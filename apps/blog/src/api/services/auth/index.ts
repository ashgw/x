import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
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

  // safe me, doesn't error whe the user is found
  public async me(): Promise<Optional<UserRo>> {
    try {
      return await this._getUserWithSession();
    } catch (error) {
      if (error instanceof InternalError) {
        if (error.code === "UNAUTHORIZED") {
          return null;
        }
      }
      throw error;
    }
  }

  // this is not used yet, but will be, or is it?
  public async clearUserSessions({
    userId,
  }: {
    userId: string;
  }): Promise<void> {
    logger.info("Clearning active user sessions");
    try {
      const user = await this.db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          sessions: {
            select: {
              id: true,
            },
          },
        },
      });
      if (user?.sessions) {
        const allSessionIds: string[] = user.sessions.map(({ id }) => id);
        await this.db.session.deleteMany({
          where: {
            id: {
              in: allSessionIds,
            },
          },
        });
      }
    } catch (error) {
      logger.error("Error occured when removing user sessions");
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove user sessions",
        cause: error,
      });
    }
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
      CookieService.csrf.clear({
        res: this.res,
      });
      CookieService.session.clear({
        res: this.res,
      });
      logger.info("User logged out", { sessionId });
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
      // fake delay
      pbkdf2Sync(password, "0".repeat(32), 1000, 32, "sha256"); // fake delay
      logger.warn("User not found for: ", { email });
      throw new InternalError({
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
      throw new InternalError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }
    logger.info("Password is valid for: ", { email });
    logger.info("checking if user has session");
    if (user.sessions.length === 0) {
      logger.info("User has no session, creating new session");
      await this._createSession({ userId: user.id });
    }
    logger.info("User has session, returning user");
    return UserMapper.toUserRo({ user });
  }

  public async register({
    email,
    password,
    name,
  }: UserRegisterDto): Promise<void> {
    logger.info("Registering user", { email });
    try {
      const existingUser = await this.db.user.findUnique({
        where: { email },
        select: {
          email: true,
        },
      });

      if (existingUser) {
        logger.warn("User with the given email already exists", { email });
        throw new InternalError({
          code: "CONFLICT",
          message: "User with this email already exists", // a smartass would use this to basically reverse engineer a couple of emails
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

      await this._createSession({
        userId: user.id,
      });
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

  // TODO: here needs more work gang
  public validateCsrfToken({
    requestCsrfHeaderValue,
  }: {
    requestCsrfHeaderValue: string;
  }): boolean {
    // origin checks, This kills cross-origin CSRF even if SameSite gets bypassed by a browser exploit somehow
    // only doing this in prod, preview & dev can pass
    if (env.NODE_ENV === "production") {
      const origin =
        this.req.headers.get("origin") ?? this.req.headers.get("referer");
      if (!origin) {
        throw new InternalError({
          code: "FORBIDDEN",
          message: "Missing Origin/Referer",
        });
      }

      const expectedOrigin = env.NEXT_PUBLIC_BLOG_URL;
      if (!origin.startsWith(expectedOrigin)) {
        throw new InternalError({
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
      throw new InternalError({
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
      const _dummyHash = pbkdf2Sync("dummy", dummySalt, 1000, 32, "sha256");

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

    this.validateCsrfToken({
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
}
