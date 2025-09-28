import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import argon2 from "argon2";
import { authEndpoints, disableSignUp, sessionExpiry } from "./consts";
import { monitor } from "@ashgw/monitor";
import { nextCookies } from "better-auth/next-js";
import { email } from "@ashgw/email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: env.AUTH_ENCRYPTON_KEY,
  appName: siteName,
  basePath: authEndpoints.basePath,
  baseURL: env.NEXT_PUBLIC_BLOG_URL,
  session: {
    expiresIn: sessionExpiry,
    modelName: "Session",
  },
  account: {
    encryptOAuthTokens: true,
    modelName: "Account",
  },
  user: {
    modelName: "User",
    additionalFields: {
      role: {
        type: "string",
        required: true,
        fieldName: "role",
        defaultValue: "VISITOR",
        input: false,
        returned: true,
      },
    },
    deleteUser: {
      afterDelete: async (user) => {
        logger.info(`User deleted: ${user.id}`);
        await email.sendNotification({
          to: env.PERSONAL_EMAIL,
          title: "User deleted",
          type: "SERVICE",
          message: `User ${user.id} was deleted.`,
        });
      },
    },
    changeEmail: {
      enabled: false,
    },
  },
  verification: {
    modelName: "Verification",
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 30 * 60, // 30 minutes
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ token, user, url }) => {
      await email.sendVerificationEmail({
        to: user.email,
        verifyUrl: `${url}${token}`,
        userName: user.name ?? undefined,
      });
    },
    onEmailVerification: async (user) => {
      await email.sendNotification({
        to: user.email,
        title: "Email verification started",
        type: "SERVICE",
        message: "Please check your inbox for the verification link.",
      });
    },
    afterEmailVerification: async (user) => {
      await email.sendWelcome({
        to: user.email,
        userName: user.name ?? undefined,
      });
    },
  },
  onAPIError: {
    errorURL: authEndpoints.error,
    throw: false,
    onError: (error, _authCtx) => {
      logger.error(`Error in auth API route: `, error);
      monitor.next.captureException({ error });
    },
  },
  advanced: {
    crossSubDomainCookies: { enabled: false },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.NEXT_PUBLIC_CURRENT_ENV === "production",
      httpOnly: true,
      maxAge: sessionExpiry,
    },
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
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp,
    onPasswordReset: async ({ user }) => {
      await email.sendNotification({
        to: user.email,
        title: "Password reset triggered",
        type: "SERVICE",
        message:
          "You initiated a password reset. If this wasn’t you, contact support.",
      });
    },
    password: {
      hash: argon2.hash,
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 15 * 60,
    sendResetPassword: async ({ token, url, user }) => {
      await email.sendPasswordReset({
        to: user.email,
        resetUrl: `${url}${token}`,
        userName: user.name ?? undefined,
      });
    },
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  trustedOrigins:
    env.NEXT_PUBLIC_CURRENT_ENV === "production"
      ? [env.NEXT_PUBLIC_BLOG_URL, env.NEXT_PUBLIC_WWW_URL]
      : undefined,
  plugins: [nextCookies()],
});
