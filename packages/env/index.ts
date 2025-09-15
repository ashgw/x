import { z } from "zod";
import { createEnv } from "@ashgw/ts-env";
import { colors } from "./colors";

import { envTuple } from "./env-tuple";
import { databaseUrlSchema } from "./schemas";

const isBrowser = typeof window !== "undefined";

const clientVars = {
  CURRENT_ENV: z
    .enum(["development", "preview", "production"])
    .describe(
      "The actual environment we're running/deploying the app in/to, since NODE_ENV can be misleading since it only checks if NextJS is built or dev really, this is manually set",
    ),
  SENTRY_DSN: z.string().url(),
  WWW_URL: z.string().url(),
  WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
  BLOG_URL: z.string().url(),
  BLOG_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
  POSTHOG_KEY: z.string().min(20).startsWith("phc_"),
  POSTHOG_HOST: z.string().url(),
};

const serverVars = {
  NODE_ENV: z
    .enum(["production", "development", "test"])
    .optional()
    .describe("NextJS is taking care of this basically"),
  SENTRY_ORG: z.string().min(2).max(255),
  X_CRON_TOKEN: z.string().length(32).max(255),
  SENTRY_PROJECT: z.string().min(2).max(255),
  SENTRY_AUTH_TOKEN: z.string().min(20).max(255),
  IP_HASH_SALT: z
    .string()
    .min(32, "IP hash salt must be at least 32 characters long")
    .describe(
      "This is used to has the IP with other fingerprinting info to see if the user is spamming my blog or nah",
    ),
  DATABASE_URL: databaseUrlSchema,
  DIRECT_URL: databaseUrlSchema,
  S3_BUCKET_NAME: z
    .string()
    .min(3, "Bucket name too short")
    .max(63, "Bucket name too long")
    .regex(/^[a-z0-9.-]+$/, "Invalid S3 bucket name"),
  S3_BUCKET_REGION: z
    .enum(["us-east-1", "us-west-1", "us-west-2", "eu-west-1"], {
      errorMap: () => ({ message: "Invalid AWS region" }),
    })
    .describe("I dont deploy anywhere else really"),
  S3_BUCKET_ACCESS_KEY_ID: z
    .string()
    .length(20, { message: "Access Key ID must be 20 chars" }),
  S3_BUCKET_SECRET_KEY: z.string().min(20, "Secret access key too short"),
  S3_BUCKET_URL: z
    .string()
    .url("Must be a valid S3 bucket URL")
    .refine(
      (url) => url.includes("amazonaws.com") || url.includes("cloudfront.net"),
      { message: "Must be a valid S3 or CloudFront URL" },
    ),
  KIT_API_KEY: z.string().min(20).startsWith("kit_").max(255),
  RESEND_API_KEY: z.string().min(20).startsWith("re_").max(255),
  PERSONAL_EMAIL: z.string().email().max(255),
};

const serverVarsTuple = envTuple(serverVars);

export const env = createEnv({
  vars: {
    ...clientVars,
    ...serverVars,
  },
  disablePrefix: [...serverVarsTuple],
  prefix: "NEXT_PUBLIC",
  runtimeEnv: {
    X_CRON_TOKEN: process.env.X_CRON_TOKEN,
    PERSONAL_EMAIL: process.env.PERSONAL_EMAIL,
    IP_HASH_SALT: process.env.IP_HASH_SALT,
    KIT_API_KEY: process.env.KIT_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
    S3_BUCKET_ACCESS_KEY_ID: process.env.S3_BUCKET_ACCESS_KEY_ID,
    S3_BUCKET_SECRET_KEY: process.env.S3_BUCKET_SECRET_KEY,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    NEXT_PUBLIC_CURRENT_ENV: process.env.NEXT_PUBLIC_CURRENT_ENV,
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
  skipValidation: isBrowser,
});

// eslint-disable-next-line no-restricted-syntax
console.log(
  `${colors.magenta("ENV")} → loaded ${colors.green(
    String(Object.keys(env).length),
  )} vars successfully.`,
);
