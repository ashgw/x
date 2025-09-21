import { env } from "@ashgw/env";
import type { RuntimeEnv } from "./types";

export function detectRuntimeEnv(): RuntimeEnv {
  return env.NEXT_PUBLIC_CURRENT_ENV;
}

export const LOGTAIL_TOKEN = env.NEXT_PUBLIC_LOGTAIL_INGESTION_TOKEN;
