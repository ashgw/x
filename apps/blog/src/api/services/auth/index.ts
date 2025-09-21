import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { AppError } from "@ashgw/error";
import { logger } from "@ashgw/logger";

import type { UserLoginDto, UserRo } from "~/api/models";
import { UserMapper } from "~/api/mappers";
import { UserQueryHelper } from "~/api/query-helpers";
import { AUTH_COOKIES_MAX_AGE, HEADER_NAMES } from "./consts";
import { CookieService } from "./cookie.service";

export class AuthService {
  private readonly db: DatabaseClient;
  private readonly req: NextRequest;
  private readonly res: NextResponse;

  constructor({
    db,
    req,
    res,
  }: {
    db: DatabaseClient;
    req: NextRequest;
    res: NextResponse;
  }) {
    this.db = db;
    this.req = req;
    this.res = res;
  }

  // safe me, doesn't error whe the user is not authenticated
  public async me(): Promise<Optional<UserRo>> {
    try {
      return await this._getUserWithSession();
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === "UNAUTHORIZED") {
          return null;
        }
      }
      throw error;
    }
  }

  public async login({ email, password }: UserLoginDto): Promise<UserRo> {
    logger.info("Logging in user", { email });
    const user = await this.db.user.findUnique({
      where: { email },
      include: {
        ...UserQueryHelper.withSessionsInclude(),
      },
    });
    if (!user) {
      // fake delay
      pbkdf2Sync(password, "0".repeat(32), 1000, 32, "sha256"); // fake delay
      logger.warn("User not found for: ", { email });
      throw new AppError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    logger.info("User found for: ", { userId: user.id });
    logger.info("Checking user password");

    if (
      !this._verifyPassword({
        plainPassword: password,
        storedHash: user.passwordHash,
      })
    ) {
      logger.warn("Invalid password for: ", { email });
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    await this._createSession({ userId: user.id });
    return UserMapper.toUserRo({ user });
  }

  public async logout() {
    logger.info("Logging out user");
    const sessionId = CookieService.session.get({
      req: this.req,
    });
    if (!sessionId) {
      logger.info("No session cookie found, user is not logged in");
      CookieService.csrf.clear({
        res: this.res,
      });
      return;
    }
    logger.info("Session cookie found, logging out user", { sessionId });
    logger.info("Clearing sessions..", { sessionId });
    await this.db.session.delete({
      where: { id: sessionId },
    });
    CookieService.csrf.clear({
      res: this.res,
    });
    CookieService.session.clear({
      res: this.res,
    });
    logger.info("User logged out", { sessionId });
  }

  public async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    logger.info("Changing user password", { userId });
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      logger.warn("User not found when changing password", { userId });
      throw new AppError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    logger.info("Validating user provided password", { userId });
    if (
      !this._verifyPassword({
        plainPassword: currentPassword,
        storedHash: user.passwordHash,
      })
    ) {
      logger.warn("Provided password does not match the user password", {
        userId,
      });
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "Incorrect password",
      });
    }

    const newPasswordHash = this._hashPassword(newPassword);

    await this.db.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
    await this.terminateAllActiveSessions({ userId });
    logger.info("Password changed successfully", { userId });
  }

  // aside from the current one the user is on
  public async terminateAllActiveSessions({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    const currentSessionId = CookieService.session.get({
      req: this.req,
    });

    if (!currentSessionId) {
      logger.warn("No session cookie found, user is not logged in");
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "No session cookie found",
      });
    }

    logger.info("Attempting to terminate sessions except current one", {
      userId,
      currentSessionId,
    });
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      logger.warn("User not found when terminating sessions", { userId });
      throw new AppError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    logger.warn("Deleting all active user sessions", { userId });
    const result = await this.db.session.deleteMany({
      where: {
        userId,
        id: { not: currentSessionId },
      },
    });

    logger.info(`Terminated ${result.count} session(s) successfully`, {
      userId,
    });
  }

  public async terminateSpecificSession({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }): Promise<void> {
    logger.info("Terminating specific user session", { userId, sessionId });
    const session = await this.db.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) {
      logger.warn(
        "Could not find an associated session with the provided session for the user",
        { userId, sessionId },
      );
      throw new AppError({
        code: "NOT_FOUND",
        message: "Session not found",
      });
    }

    if (session.userId !== userId) {
      logger.warn(
        "TEMPERING: provided user ID does not match the actual session associated user ID",
        {
          sessionId,
          requestingUserId: userId,
          sessionOwnerId: session.userId,
        },
      );

      throw new AppError({
        code: "FORBIDDEN",
        message: "You are not allowed to terminate this session",
      });
    }
    logger.info("Terminating user session", { sessionId });
    await this.db.session.delete({
      where: { id: sessionId },
    });
  }

  private _validateCsrfToken({
    requestCsrfHeaderValue,
  }: {
    requestCsrfHeaderValue: string;
  }): boolean {
    // origin checks – only enforce extra check in prod
    if (
      env.NEXT_PUBLIC_CURRENT_ENV === "production" &&
      this.req.headers.get("host") === new URL(env.NEXT_PUBLIC_BLOG_URL).host
    ) {
      const origin =
        this.req.headers.get("origin") ?? this.req.headers.get("referer");
      if (!origin) {
        throw new AppError({
          code: "FORBIDDEN",
          message: "Missing Origin/Referer",
        });
      }

      const expectedOrigin = env.NEXT_PUBLIC_BLOG_URL;
      if (!origin.startsWith(expectedOrigin)) {
        throw new AppError({
          code: "FORBIDDEN",
          message: "CSRF origin mismatch",
        });
      }
    }

    // if the token presented in the cookie and the header don't match, we block
    const csrfCookieToken = CookieService.csrf.get({
      req: this.req,
    });

    if (!csrfCookieToken || csrfCookieToken !== requestCsrfHeaderValue) {
      logger.warn("CSRF validation failed");
      throw new AppError({
        code: "FORBIDDEN",
        message: "Invalid CSRF token",
      });
    }
    CookieService.csrf.set({ res: this.res }); // rotate the token now for a fresh login
    return true;
  }

  private async _createSession(input: { userId: string }) {
    const expiresAt = new Date(Date.now() + AUTH_COOKIES_MAX_AGE);
    const session = await this.db.session.create({
      data: {
        userId: input.userId,
        expiresAt,
      },
      select: {
        id: true,
      },
    });

    CookieService.csrf.set({
      res: this.res,
    });
    CookieService.session.set({
      res: this.res,
      value: session.id,
    });
  }

  private _hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, 1000, 32, "sha256").toString("hex");
    return `${salt}:${hash}`;
  }

  private _verifyPassword({
    plainPassword,
    storedHash,
  }: {
    plainPassword: string;
    storedHash: string;
  }): boolean {
    try {
      const [salt, originalHash] = storedHash.split(":");

      // Always produce a hash, even if inputs are invalid, to keep time constant
      const dummySalt = "0".repeat(32); // fake salt
      pbkdf2Sync("dummy", dummySalt, 1000, 32, "sha256");

      if (!salt || !originalHash) {
        pbkdf2Sync(plainPassword, dummySalt, 1000, 32, "sha256"); // fake work
        return false;
      }

      const inputHash = pbkdf2Sync(plainPassword, salt, 1000, 32, "sha256");
      const storedHashBuffer = Buffer.from(originalHash, "hex");

      // Compare length before comparing contents to avoid exceptions
      if (inputHash.length !== storedHashBuffer.length) {
        return false;
      }

      return timingSafeEqual(inputHash, storedHashBuffer);
    } catch (error) {
      logger.error("Password verification error", { error });
      return false;
    }
  }

  private async _getUserWithSession(): Promise<UserRo> {
    const sessionId = CookieService.session.get({ req: this.req });
    if (!sessionId) {
      logger.info("No session cookie found");
      throw new AppError({
        code: "UNAUTHORIZED",
        message: `No session cookie found`,
      });
    }

    const csrfCookieToken = CookieService.csrf.get({
      req: this.req,
    });

    const csrfHeaderToken = this.req.headers.get(HEADER_NAMES.CSRF_TOKEN);

    if (!csrfCookieToken || !csrfHeaderToken) {
      const message = `No CSRF token found, login again`;
      logger.info(message);
      throw new AppError({
        code: "UNAUTHORIZED",
        message,
      });
    }

    this._validateCsrfToken({
      requestCsrfHeaderValue: csrfHeaderToken,
    });

    const session = await this.db.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            ...UserQueryHelper.withSessionsInclude(),
          },
        },
      },
    });

    if (!session) {
      logger.info("Session not found", { sessionId });
      throw new AppError({
        code: "UNAUTHORIZED",
        message: `No session found for this user`,
      });
    }

    if (session.expiresAt < new Date()) {
      logger.info("Session expired", { sessionId });
      throw new AppError({
        code: "UNAUTHORIZED",
        message: `Session expired`,
      });
    }

    return UserMapper.toUserRo({ user: session.user });
  }
}
