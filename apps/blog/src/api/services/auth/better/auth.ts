import { db } from "@ashgw/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@ashgw/env";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
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
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
