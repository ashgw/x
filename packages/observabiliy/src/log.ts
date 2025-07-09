/* eslint-disable */
import { NextConfig } from "next";
import { log, withLogtail } from "@logtail/next";

// import { log } from "@logtail/next";
import { env } from "@ashgw/env";

// add OT if shit get serious
const thirdParty = console; // would use logtail, but no need for now
const defaultLogger = console;
export const logger =
  env.NODE_ENV === "production" ? thirdParty : defaultLogger;

// not used rn
export const withLogging = (config: NextConfig): NextConfig => {
  return withLogtail(config);
};
