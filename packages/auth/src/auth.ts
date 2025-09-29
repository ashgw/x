import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import argon2 from "argon2";
import { authEndpoints, disableSignUp, sessionExpiry } from "./consts";
import { monitor } from "@ashgw/monitor";
import { nextCookies } from "better-auth/next-js"; //  needed for server side
import { send } from "@ashgw/email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: env.AUTH_ENCRYPTON_KEY,
  appName: siteName,
  basePath: authEndpoints.basePath,
  baseURL: env.NEXT_PUBLIC_BLOG_URL, // TODO: this should be the API or "app"
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
        await email.sendAccountDeleted({
          to: user.email,
          userName: user.name,
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
    expiresIn: 30 * 60, // 30 minutes,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ token, user, url }) => {
      logger.debug("sendVerificationEmail with URL & token" + url + token);
      await email.sendVerifyEmail({
        to: user.email,
        userName: user.name,
        verifyUrl: `${url}`,
      });
    },

    afterEmailVerification: async (user) => {
      await email.sendEmailIsVerified({
        to: user.email,
        userName: user.name,
      });
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
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // subdomain takeover attacks can wait
    },
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.NEXT_PUBLIC_CURRENT_ENV === "production",
      httpOnly: true,
      // In my old setup I had to send & read a CSRF cookie manually & also check the origin header, (read my blog why)
      // but better-auth handles CSRF with only the origin header, which is cool too.
      // partitioned: env.NEXT_PUBLIC_CURRENT_ENV === "production", // not needed
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
  socialProviders: {
    // uncomment if needed
    // google: {
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    //   disableSignUp,
    // },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp,
    onPasswordReset: ({ user }) => {
      logger.debug(`Password reset for user: ${user.id}`);
    },
    password: {
      hash: argon2.hash,
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
    requireEmailVerification: false, // TODO: set it back to true
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
    sendResetPassword: async ({ token, url, user }) => {
      await email.sendResetPassword({
        to: user.email,
        resetUrl: `${url}${token}`,
        userName: user.name,
      });
    },
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  trustedOrigins:
    env.NEXT_PUBLIC_CURRENT_ENV === "production"
      ? [env.NEXT_PUBLIC_BLOG_URL, env.NEXT_PUBLIC_WWW_URL]
      : undefined,
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
