/* eslint-disable */
import { env } from "@ashgw/env";

const thirdParty = console;
const defaultLogger = console;
export const logger =
  env.NODE_ENV === "production" ? thirdParty : defaultLogger;
