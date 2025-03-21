import path from "path";
import type { UnionToTuple } from "ts-roids";
import { config } from "dotenv";
import { z } from "zod";

import { createEnv, preset } from "@ashgw/ts-env";

config({ path: path.resolve(__dirname, "../../.env") });

const isBrowser = typeof window !== "undefined";

const vercelPreset = preset("vercel");

export const env = createEnv({
  vars: {
    NODE_ENV: z.enum(["production", "development", "preview"]),
    WWW_URL: z.string().url(),
    BLOG_URL: z.string().url(),
    WWW_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    BLOG_GOOGLE_ANALYTICS_ID: z.string().min(7).startsWith("G-"),
    ...vercelPreset,
  },
  disablePrefix: [
    "NODE_ENV",
    ...(Object.keys(vercelPreset) as UnionToTuple<keyof typeof vercelPreset>),
  ],
  prefix: "NEXT_PUBLIC",
  skipValidation: isBrowser, // Since env vars are already injected at build time, we don't need to validate them at runtime.
});
