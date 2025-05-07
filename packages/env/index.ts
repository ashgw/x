import path from "path";
import type { Keys, UnionToTuple } from "ts-roids";
import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@ashgw/ts-env";

// for ESM and CommonJS
let rootDir = process.cwd();

rootDir = typeof __dirname !== "undefined" ? __dirname : rootDir;

config({
  path: path.resolve(
    rootDir,
    process.env.NODE_ENV === "production"
      ? "../../.env.production"
      : "../../.env.development",
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
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("postgres://") || url.startsWith("postgresql://"),
      {
        message: "Must be a valid Neon Postgres URL",
      },
    ),

  S3_BUCKET_NAME: z
    .string()
    .min(3, "Bucket name too short")
    .max(63, "Bucket name too long")
    .regex(/^[a-z0-9.-]+$/, "Invalid S3 bucket name"),

  S3_BUCKET_REGION: z.enum(
    [
      "us-east-1",
      "us-west-1",
      "us-west-2",
      "eu-west-1",
      "eu-central-1",
      "ap-southeast-1",
      "ap-northeast-1",
      "ap-south-1",
      "sa-east-1",
    ],
    {
      errorMap: () => ({ message: "Invalid AWS region" }),
    },
  ),

  S3_BUCKET_ACCESS_KEY_ID: z.string().min(20, "Secret access key too short"),

  S3_BUCKET_SECRET_KEY: z.string().min(20, "Secret access key too short"),

  S3_BUCKET_URL: z
    .string()
    .url("Must be a valid S3 bucket URL")
    .refine(
      (url) => url.includes("amazonaws.com") || url.includes("cloudfront.net"),
      {
        message: "Must be a valid S3 or CloudFront URL",
      },
    ),

  KIT_API_KEY: z.string().min(20).startsWith("kit_"),
};

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
    KIT_API_KEY: process.env.KIT_API_KEY,
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
