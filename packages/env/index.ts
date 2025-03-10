import path from "path";
import { config } from "dotenv";
import { z } from "zod";

import { createEnv } from "@ashgw/ts-env";

config({ path: path.resolve(__dirname, "../../.env") });

const isBrowser = typeof window !== "undefined";

export const env = createEnv({
  vars: {
    NODE_ENV: z.enum(["production", "development", "preview"]),
    WWW_URL: z.string().url(),
    WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    BLOG_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    BLOG_URL: z.string().url(),
  },
  disablePrefix: ["NODE_ENV"],
  prefix: "NEXT_PUBLIC",
  skipValidation: isBrowser, // Skip validation in the browser to prevent runtime errors.
  // Since env vars are already injected at build time, we don't need to validate them at runtime.
});
