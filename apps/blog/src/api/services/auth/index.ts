import argon2 from "argon2";
import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { AppError } from "@ashgw/error";
import { logger } from "@ashgw/logger";
import { authClient } from "@ashgw/auth";
import type { UserLoginDto, UserRo } from "~/api/models";
import { UserMapper } from "~/api/mappers";
import { UserQueryHelper } from "~/api/query-helpers";

export class AuthService {
  private readonly db: DatabaseClient;

  constructor({ db }: { db: DatabaseClient }) {
    this.db = db;
  }

  // safe me, doesn't error when the user is not authenticated
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
    const user = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (!user.data) {
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

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
    const ok = await this._verifyPassword({
      plainPassword: currentPassword,
      storedHash: user.passwordHash,
    });

    if (!ok) {
      logger.warn("Provided password does not match the user password", {
        userId,
      });
      throw new AppError({
        code: "UNAUTHORIZED",
        message: "Incorrect password",
      });
    }

    const newPasswordHash = await this._hashPassword(newPassword);

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
    // origin checks only enforced in prod
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

    // if the token in the cookie and the header do not match, block
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

  private async _hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 64 * 1024, // 64 MB
      timeCost: 2,
      parallelism: 1,
    });
  }

  private async _verifyPassword({
    plainPassword,
    storedHash,
  }: {
    plainPassword: string;
    storedHash: string;
  }): Promise<boolean> {
    try {
      return await argon2.verify(storedHash, plainPassword);
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
