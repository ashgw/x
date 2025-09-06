// import path from "path";
import type { Keys, UnionToTuple } from "ts-roids";
// import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@ashgw/ts-env"; // @see https://github.com/ashgw/ts-env
import { colors } from "./colors";

// im using a custom zsh function locally to load whatever .env file i want, checkout ashgw/zshfuncs/env.zsh
// if u need to use a file based setup, uncomment this, just know when using path etc.. it won't work on the edge

// const isRunningInCi = process.env.CI === "true";

// function configureFileBasedEnv() {
//   let rootDir = process.cwd();
//   rootDir = typeof __dirname !== "undefined" ? __dirname : rootDir;

//   const envPath = path.resolve(
//     rootDir,
//     process.env.NODE_ENV === "production"
//       ? "../../.env.production"
//       : process.env.NODE_ENV === "preview"
//         ? "../../.env.preview"
//         : "../../.env.development",
//   );

//   const res = config({ path: envPath });
//   const count = res.parsed ? Object.keys(res.parsed).length : 0;
//   // eslint-disable-next-line no-restricted-syntax
//   console.log(
//     `${colors.magenta("ENV")} → loaded ${colors.green(String(count))} vars from ${colors.cyan(envPath)}`,
//   );
// }

// if (!isRunningInCi) {
//   configureFileBasedEnv();
// } else {
//   // eslint-disable-next-line no-restricted-syntax
//   console.log(
//     `${colors.magenta("ENV")} → using vars from ${colors.yellow("CI")}`,
//   );
// }

// eslint-disable-next-line no-restricted-syntax
console.log(`${colors.magenta("ENV")} → loaded.`);

const isBrowser = typeof window !== "undefined";

// AKA non predfixed vars
const serverSideVars = {
  NODE_ENV: z.enum(["production", "development", "preview", "test"]).optional(),
  SENTRY_ORG: z.string(),
  SENTRY_PROJECT: z.string(),
  SENTRY_AUTH_TOKEN: z.string().min(20),
  IP_HASH_SALT: z
    .string()
    .min(32, "IP hash salt must be at least 32 characters long"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .url("Must be a valid URL")
    .refine(
      (url) =>
        process.env.NODE_ENV === "development" ||
        url.startsWith("postgres://") ||
        url.startsWith("postgresql://"),
      { message: "Must be a valid Neon Postgres URL" },
    ),
  DIRECT_URL: z.string().url().startsWith("postgres"),
  S3_BUCKET_NAME: z
    .string()
    .min(3, "Bucket name too short")
    .max(63, "Bucket name too long")
    .regex(/^[a-z0-9.-]+$/, "Invalid S3 bucket name"),
  S3_BUCKET_REGION: z.enum(
    ["us-east-1", "us-west-1", "us-west-2", "eu-west-1"],
    { errorMap: () => ({ message: "Invalid AWS region" }) },
  ),
  S3_BUCKET_ACCESS_KEY_ID: z.string().min(20, "Secret access key too short"),
  S3_BUCKET_SECRET_KEY: z.string().min(20, "Secret access key too short"),
  S3_BUCKET_URL: z
    .string()
    .url("Must be a valid S3 bucket URL")
    .refine(
      (url) => url.includes("amazonaws.com") || url.includes("cloudfront.net"),
      { message: "Must be a valid S3 or CloudFront URL" },
    ),
  KIT_API_KEY: z.string().min(20).startsWith("kit_"),
};

type ServerSideVars = typeof serverSideVars;

const ServerSideVarsTuple = Object.keys(serverSideVars) as UnionToTuple<
  Keys<ServerSideVars>
>;

export const env = createEnv({
  vars: {
    ...serverSideVars,
    SENTRY_DSN: z.string().url(),
    WWW_URL: z.string().url(),
    WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    BLOG_URL: z.string().url(),
    BLOG_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    POSTHOG_KEY: z.string().min(20).startsWith("phc_"),
    POSTHOG_HOST: z.string().url(),
  },
  disablePrefix: [...ServerSideVarsTuple],
  prefix: "NEXT_PUBLIC",
  runtimeEnv: {
    IP_HASH_SALT: process.env.IP_HASH_SALT,
    KIT_API_KEY: process.env.KIT_API_KEY,
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
