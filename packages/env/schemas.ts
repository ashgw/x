import { z } from "zod";

export const databaseUrlSchema = z
  .string()
  .min(1, "DATABASE_URL is required")
  .url("Must be a valid URL")
  .superRefine((url, ctx) => {
    const env = process.env.NEXT_PUBLIC_CURRENT_ENV;

    if (env === "production" && !url.includes("supabase")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In production, databse must be Supabase'",
      });
    }

    if (env === "preview" && !url.includes("neon")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In preview, database must be a Neon temp branch",
      });
    }

    if (env === "development" && !url.includes("localhost")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In development, database must point to a local container",
      });
    }
  });
