import path from "path";
import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@ashgw/ts-env";

config({
  path: path.resolve(__dirname, "../../.env.development"),
});

export const env = createEnv({
  vars: {
    // @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#recommended-connection-pool-size-1
    // here append the &connection_limit=1 (or 2, 3..) to the DATABASE_URL
    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required")
      .url("Must be a valid URL")
      .refine(
        (url) => {
          const regex = /connection_limit=(\d+)$/;
          const match = regex.exec(url);
          const limit = parseInt(match?.[1] ?? "0");
          return limit >= 1 && limit <= 7;
        },
        {
          message: "Connection limit must be between 1 and 7",
        },
      )
      .refine(
        (url) =>
          url.startsWith("postgres://") || url.startsWith("postgresql://"),
        {
          message: "Must be a valid Neon Postgres URL",
        },
      )
      .refine((url) => url.includes(".neon."), {
        message: "Must be a Neon database URL",
      }),

    S3_BUCKET_NAME: z
      .string()
      .min(3, "Bucket name too short")
      .max(63, "Bucket name too long")

      .regex(/^[a-z0-9.-]+$/, "Invalid S3 bucket name"),

    S3_BUCKET_REGION: z.enum(
      // murica
      ["us-east-1", "us-east-2", "us-west-1", "us-west-2"],
      {
        errorMap: () => ({ message: "Invalid AWS region" }),
      },
    ),

    S3_BUCKET_URL: z
      .string()
      .url("Must be a valid S3 bucket URL")
      .refine(
        (url) =>
          url.includes("amazonaws.com") || url.includes("cloudfront.net"),
        {
          message: "Must be a valid S3 or CloudFront URL",
        },
      ),
    // the IAM user data, refer to the infra directory over how it's setup
    S3_BUCKET_ACCESS_KEY_ID: z.string().min(20, "Secret access key too short"),
    S3_BUCKET_SECRET_KEY: z.string().min(20, "Secret access key too short"),
  },
  runtimeEnv: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
    S3_BUCKET_ACCESS_KEY_ID: process.env.S3_BUCKET_ACCESS_KEY_ID,
    S3_BUCKET_SECRET_KEY: process.env.S3_BUCKET_SECRET_KEY,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
