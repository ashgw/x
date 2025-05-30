import { pbkdf2Sync, randomBytes } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { InternalError, logger } from "@ashgw/observability";

import type { UserLoginDto, UserRegisterDto, UserRo } from "~/api/models";
import { UserMapper } from "~/api/mappers";
import { UserQueryHelper } from "~/api/query-helpers";
import { AUTH_COOKIES_MAX_AGE, HEADER_NAMES } from "./consts";
import { CookieService } from "./Cookie.service";

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

  public async me(): Promise<Optional<UserRo>> {
    try {
      return await this.getUserWithSession();
    } catch (error) {
      if (error instanceof InternalError) {
        if (error.code === "UNAUTHORIZED") {
          return null;
        }
      }
      throw error;
    }
  }

  public async getUserWithSession(): Promise<UserRo> {
    const sessionId = CookieService.session.get({ req: this.req });
    if (!sessionId) {
      logger.info("No session cookie found");
      throw new InternalError({
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
      throw new InternalError({
        code: "UNAUTHORIZED",
        message,
      });
    }

    if (csrfCookieToken !== csrfHeaderToken) {
      const message = `CSRF token mismatch, possible tampering`;
      logger.warn(message, {
        csrfCookieToken,
        csrfHeaderToken,
      });

      throw new InternalError({
        code: "UNAUTHORIZED",
        message,
      });
    }

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
      throw new InternalError({
        code: "UNAUTHORIZED",
        message: `No session found for this user`,
      });
    }

    if (session.expiresAt < new Date()) {
      logger.info("Session expired", { sessionId });
      throw new InternalError({
        code: "UNAUTHORIZED",
        message: `Session expired`,
      });
    }

    return UserMapper.toUserRo({ user: session.user });
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
    try {
      await this.db.session.delete({
        where: { id: sessionId },
      });
      logger.info("User logged out", { sessionId });
      CookieService.csrf.clear({
        res: this.res,
      });
      CookieService.session.clear({
        res: this.res,
      });
    } catch (error) {
      logger.error("Failed to logout user", { error, sessionId });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to logout",
        cause: error,
      });
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
      logger.warn("User not found", { email });
      throw new InternalError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    logger.info("User found", { userId: user.id });
    logger.info("Checking user password");

    if (!this._verifyPassword(password, user.passwordHash)) {
      logger.warn("Invalid password", { email });
      throw new InternalError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }
    logger.info("Password is valid", { email });
    logger.info("checking if user has session");
    if (user.sessions.length === 0) {
      logger.info("User has no session, creating new session");
      await this._createSessionAndSetCookies({ userId: user.id });
    }
    logger.info("User has session, returning user");
    return UserMapper.toUserRo({ user });
  }

  public async register({
    email,
    password,
    name,
  }: UserRegisterDto): Promise<UserRo> {
    logger.info("Registering user", { email });
    try {
      const existingUser = await this.db.user.findUnique({
        where: { email },
        select: {
          email: true,
        },
      });

      if (existingUser) {
        logger.warn("User already exists", { email });
        throw new InternalError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }
      logger.info("Creating user", { email, name });
      const passwordHash = this._hashPassword(password);
      const user = await this.db.user.create({
        data: {
          email,
          passwordHash,
          name,
          // Default role is VISITOR, set in schema
        },
        include: {
          ...UserQueryHelper.withSessionsInclude(),
        },
      });
      logger.info("Creating database and browser sessions", {
        userId: user.id,
      });

      await this._createSessionAndSetCookies({
        userId: user.id,
      });
      return UserMapper.toUserRo({ user });
    } catch (error) {
      logger.error("Registration failed", { error, email });
      if (error instanceof InternalError) {
        throw error;
      }
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to register user",
        cause: error,
      });
    }
  }

  public validateCsrfToken(input: { requestCsrfHeaderValue: string }): boolean {
    const csrfCookie = CookieService.csrf.get({
      req: this.req,
    });
    const csrfHeader = input.requestCsrfHeaderValue;
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      logger.warn("CSRF validation failed");
      throw new InternalError({
        code: "FORBIDDEN",
        message: "Invalid CSRF token",
      });
    }
    return true;
  }

  private async _createSessionAndSetCookies(input: { userId: string }) {
    const expiresAt = new Date(Date.now() + AUTH_COOKIES_MAX_AGE);
    const session = await this.db.session.create({
      data: {
        userId: input.userId,
        expiresAt,
      },
      select: {
        id: true,
        userId: true,
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
    // Generate a random salt
    const salt = randomBytes(16).toString("hex");
    // Hash the password with the salt using PBKDF2
    const hash = pbkdf2Sync(password, salt, 1000, 32, "sha256").toString("hex");
    // Return the salt and hash concatenated
    return `${salt}:${hash}`;
  }

  private _verifyPassword(password: string, storedHash: string): boolean {
    try {
      const [salt, originalHash] = storedHash.split(":");

      // Check if salt exists
      if (!salt) {
        logger.error("Invalid hash format, missing salt");
        return false;
      }

      // Hash the input password with the same salt
      const hash = pbkdf2Sync(password, salt, 1000, 32, "sha256").toString(
        "hex",
      );
      // Compare the calculated hash with the stored hash
      return hash === originalHash;
    } catch (error) {
      logger.error("Password verification error", { error });
      return false;
    }
  }
}
