import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import argon2 from "argon2";
import { authEndpoints } from "./endpoints";
import { monitor } from "@ashgw/monitor";

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
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 30 * 60, // 30 minutes,
    sendOnSignIn: true,
    onEmailVerification: async (user) => {
      await Promise.resolve();
      logger.debug(`Sending email verification to user: ${user.id}`);
      // TODO : send email here & remove logger
    },
    afterEmailVerification: async (user) => {
      logger.debug(`Email verified for user: ${user.id}`);
      await Promise.resolve();
      // TODO: send email here & remove logger
    },
  },
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
      logger.debug(`Reset password for user: ${user.id}, ${url}${token}`);
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
    errorURL: authEndpoints.error /* 
    When errorURL is provided, the error will be added to the URL as a query parameter
    and the user will be redirected to the errorURL.
    TODO: creaet the login in the app so it tells the user what's up
    */,
    throw: false, // I'll handle it
    onError: (error, _authCtx) => {
      logger.error(`Error in auth API route: `, error);
      monitor.next.captureException({
        error,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
