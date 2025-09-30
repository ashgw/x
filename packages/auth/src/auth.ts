import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import { hash, verify } from "@ashgw/security";
import { monitor } from "@ashgw/monitor";
import { nextCookies } from "better-auth/next-js";
import { send } from "@ashgw/email";
import { rl } from "./rl";
import { toNextJsHandler } from "better-auth/next-js";

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
        await send.auth.accountDeleted({
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
    expiresIn: 30 * 60,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await send.auth.verifyEmail({
        to: user.email,
        userName: user.name,
        verifyUrl: `${url}`,
      });
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp,
    password: {
      hash,
      verify: ({ hash, password }) => verify(hash, password),
    },
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 15 * 60,
    sendResetPassword: async ({ url, user }) => {
      await send.auth.resetPassword({
        to: user.email,
        resetUrl: url,
        userName: user.name,
      });
    },
    maxPasswordLength: 128,
    minPasswordLength: 8,
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
    cookiePrefix: "ccksz",
    crossSubDomainCookies: {
      enabled: false,
    },
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

  trustedOrigins:
    env.NEXT_PUBLIC_CURRENT_ENV === "production"
      ? [env.NEXT_PUBLIC_BLOG_URL, env.NEXT_PUBLIC_WWW_URL]
      : undefined,

  plugins: [
    twoFactor({
      issuer: siteName,
      totpOptions: {
        digits: 6,
        disable: false,
        period: 30,
        backupCodes: {
          length: 10,
          amount: 5,
          storeBackupCodes: "encrypted",
        },
      },
      skipVerificationOnEnable: false,
      schema: {
        twoFactor: {
          modelName: "TwoFactor",
        },
      },
    }),
    nextCookies(),
  ],
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    max: 10,
    window: 60,
    customStorage: {
      get: async (key) => {
        const rec = await rl.inspect(key);
        return rec
          ? { key, lastRequest: rec.updatedAt, count: Math.floor(rec.tokens) }
          : undefined;
      },
      set: async (key, value) => {
        await rl.setRecord(key, value.count, value.lastRequest);
      },
    },
  },
  socialProviders: {
    // google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, disableSignUp },
  },
});

export const setupAuth = ({
  trustedProductionOrigins,
  baseURL,
  basePath = "/api/auth",
  appName,
  disableSignUp = false,
  sessionExpirySeconds = 60 * 60 * 24 * 14, // 14 days
}: {
  trustedProductionOrigins?: string[];
  baseURL: string;
  basePath?: string;
  appName: string;
  sessionExpirySeconds?: number;
  disableSignUp: boolean;
}) => {
  const auth = betterAuth({
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    secret: env.AUTH_ENCRYPTON_KEY,
    appName,
    basePath,
    baseURL,

    session: {
      expiresIn: sessionExpirySeconds,
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
          await send.auth.accountDeleted({
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
      expiresIn: 30 * 60,
      sendOnSignIn: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await send.auth.verifyEmail({
          to: user.email,
          userName: user.name,
          verifyUrl: `${url}`,
        });
      },
    },

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      disableSignUp,
      password: {
        hash,
        verify: ({ hash, password }) => verify(hash, password),
      },
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 15 * 60,
      sendResetPassword: async ({ url, user }) => {
        await send.auth.resetPassword({
          to: user.email,
          resetUrl: url,
          userName: user.name,
        });
      },
      maxPasswordLength: 128,
      minPasswordLength: 8,
    },

    onAPIError: {
      errorURL: basePath + "/error",
      throw: false,
      onError: (error, _authCtx) => {
        logger.error(`>>> Auth Service Error: `, error);
        monitor.next.captureException({ error });
      },
    },

    advanced: {
      cookiePrefix: appName,
      crossSubDomainCookies: {
        enabled: false,
      },
      defaultCookieAttributes: {
        sameSite: "lax",
        secure: env.NEXT_PUBLIC_CURRENT_ENV === "production",
        httpOnly: true,
        maxAge: sessionExpirySeconds,
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

    trustedOrigins:
      trustedProductionOrigins && env.NEXT_PUBLIC_CURRENT_ENV === "production"
        ? trustedProductionOrigins
        : undefined,
    plugins: [
      twoFactor({
        issuer: siteName,
        totpOptions: {
          digits: 6,
          disable: false,
          period: 30,
          backupCodes: {
            length: 10,
            amount: 5,
            storeBackupCodes: "encrypted",
          },
        },
        skipVerificationOnEnable: false,
        schema: {
          twoFactor: {
            modelName: "TwoFactor",
          },
        },
      }),
      nextCookies(),
    ],
    rateLimit: {
      enabled: true,
      storage: "secondary-storage",
      max: 10,
      window: 60,
      customStorage: {
        get: async (key) => {
          const rec = await rl.inspect(key);
          return rec
            ? {
                key,
                lastRequest: rec.updatedAt,
                count: Math.floor(rec.tokens),
              }
            : undefined;
        },
        set: async (key, value) => {
          await rl.setRecord(key, value.count, value.lastRequest);
        },
      },
    },
    socialProviders: {
      // google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, disableSignUp },
    },
  });
  return {
    handler: {
      next: toNextJsHandler(auth),
      // can add other if needed
    },
    auth,
  };
};
