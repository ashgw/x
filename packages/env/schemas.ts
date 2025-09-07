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
        message: "In production, DATABASE_URL must be 'supabase'",
      });
    }

    if (env === "development" && !url.includes("localhost")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In development, DATABASE_URL must point to localhost",
      });
    }

    if (env === "preview" && !url.includes("neon")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "In preview, DATABASE_URL must be neon",
      });
    }
  });
