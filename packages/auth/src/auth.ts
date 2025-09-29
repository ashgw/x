import { db } from "@ashgw/db";
import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { env } from "@ashgw/env";
import { siteName } from "@ashgw/constants";
import {hash, verify} from "@ashgw/security";
import { authEndpoints, disableSignUp, sessionExpiry } from "./consts";
import { monitor } from "@ashgw/monitor";
import { nextCookies } from "better-auth/next-js"; //  needed for server side
import { send, NotificationType } from "@ashgw/email";
import {} from 'limico'

const rl = new RateLimiterService({

})


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
    resetPasswordTokenExpiresIn: 15 * 60, // 15 minutes
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
        period: 30, // 30 secs
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
      otpOptions: {
        async sendOTP({ user, otp }) {
          await send.notification.notify({
            to: user.email,
            title: "Your security code",
            subject: "Your security code",
            type: NotificationType.SERVICE,
            messageMd:
              `Use this code to finish signing in: **${otp}**\n\n` +
              `If you didn’t request this, ignore this email.`,
          });
        },
      },
    }),
    // !! IMPORTANT: keep last
    nextCookies(),
  ],
  rateLimit: {
    enabled: env.NEXT_PUBLIC_CURRENT_ENV === "production",
    storage: "secondary-storage",
    max: 10, // allow 10 requests -> 
    window: 20, // every 20 seconds // these are harsh limits as they only apply to the client which we don't use, but abusers might REST us
    customStorage: {
      get: async (key) => {
        return await rl.getAsync(key)
      },
      set: async (key, value) => {
        return await rl.setAsync(value),
      },
    },
  },
  socialProviders: {
    // google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, disableSignUp },
  },
});
