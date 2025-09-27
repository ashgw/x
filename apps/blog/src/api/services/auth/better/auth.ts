import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import argon2 from "argon2";
import { authEndpoints } from "./endpoints";
import {AppError} from '@ashgw/error'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  basePath: authEndpoints.basePath,
  baseURL: env.NEXT_PUBLIC_BLOG_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 14, // 14 days (default is 7)
  },
  account: {
    encryptOAuthTokens: true,
    modelName: "account",
  },
  verification: {
    modelName: "verification",
  },
  secret: env.AUTH_ENCRYPTON_KEY,
  appName: siteName,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp: true,
    onPasswordReset: async ({ user }) => {
      logger.debug(`Password reset for user: ${user.id}`);
      await Promise.resolve();
      // TODO: send email here & remove logger
    },
    password: {
      hash: argon2.hash,
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
    sendResetPassword: async ({ token, url, user }) => {
      logger.debug(`Reset password for user: ${user.id}, ${url}` + token);
      await Promise.resolve();
    },
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  logger: {
    level: "info",
    log(level, message) {
      return level === "info"
        ? logger.info(message)
        : level === "warn"
          ? logger.warn(message)
          : logger.error(message);
    },
  },
  onAPIError: {
    errorURL: authEndpoints.error,
    throw: false, // I'll handle it so it comes typed
    onError: async (error, _authCtx) => {
      const err = AppError.fromUnknown(error)                                       
      logger.error(
        `Error in auth API route: ${err.message}`,
      );
      await Promise.resolve();
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
