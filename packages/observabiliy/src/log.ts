/* eslint-disable */
import { env } from "@ashgw/env";

// add OT if shit get serious
const thirdParty = console; // here plug in any provider
const defaultLogger = console;
export const logger =
  env.NODE_ENV === "production" ? thirdParty : defaultLogger;
