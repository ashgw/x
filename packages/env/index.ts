import path from "path";
import type { Keys, UnionToTuple } from "ts-roids";
import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@ashgw/ts-env";

config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../../.env.production"
      : "../../.env.development", // preview is already handled by vercel
  ),
});

const isBrowser = typeof window !== "undefined";

// A.K.A serverside vars
const nonPrefixedVars = {
  NODE_ENV: z.enum(["production", "development", "preview", "test"]),
  SENTRY_ORG: z.string(),
  SENTRY_PROJECT: z.string(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
  SENTRY_AUTH_TOKEN: z.string().min(20),
  DATABASE_URL: z.string().min(1).url(),
  S3_BUCKET_NAME: z.string().min(1),
  S3_BUCKET_REGION: z.string().min(1),
  S3_BUCKET_ACCESS_KEY_ID: z.string().min(1),
  S3_BUCKET_SECRET_KEY: z.string().min(1),
  S3_BUCKET_URL: z.string().url(),
} as const;

type NonPrefixedVars = typeof nonPrefixedVars;

const NonPrefixedVarsTuple = Object.keys(nonPrefixedVars) as UnionToTuple<
  Keys<NonPrefixedVars>
>;

export const env = createEnv({
  vars: {
    ...nonPrefixedVars,
    SENTRY_DSN: z.string().url(),
    WWW_URL: z.string().url(),
    BLOG_URL: z.string().url(),
    WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    BLOG_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    POSTHOG_KEY: z.string().min(20).startsWith("phc_"),
    POSTHOG_HOST: z.string().url(),
  },
  disablePrefix: [...NonPrefixedVarsTuple],
  prefix: "NEXT_PUBLIC",
  runtimeEnv: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
    S3_BUCKET_ACCESS_KEY_ID: process.env.S3_BUCKET_ACCESS_KEY_ID,
    S3_BUCKET_SECRET_KEY: process.env.S3_BUCKET_SECRET_KEY,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SENTRY_ORG: process.env.SENTRY_ORG,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_WWW_URL: process.env.NEXT_PUBLIC_WWW_URL,
    NEXT_PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  skipValidation: isBrowser, // Since env vars are already injected at build time, we don't need to validate them at runtime.
});
