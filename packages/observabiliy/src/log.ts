import type { NextConfig } from "next";
import { withLogtail } from "@logtail/next";

import { env } from "@ashgw/env";

// eslint-disable-next-line no-restricted-syntax
const thirdParty = console; // would use logtail, but no need for now

// eslint-disable-next-line no-restricted-syntax
const localLogger = console;
export const logger =
  env.CURRENT_ENV === "production" ? thirdParty : localLogger;

// not used rn, use this with `next.js` config
export const withLogging = (config: NextConfig): NextConfig => {
  return withLogtail(config);
};
