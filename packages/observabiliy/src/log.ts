/* eslint-disable */
import type { NextConfig } from "next";
import { withLogtail } from "@logtail/next";

import { env } from "@ashgw/env";

// add OT if shit get serious
const thirdParty = console; // would use logtail, but no need for now
const defaultLogger = console;
export const logger =
  env.CURRENT_ENV === "production" ? thirdParty : defaultLogger;

// not used rn, use this with `next.js` config
export const withLogging = (config: NextConfig): NextConfig => {
  return withLogtail(config);
};
