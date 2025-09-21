import * as SentryLib from "@sentry/nextjs";

import { captureException } from "./captureException";
import { initializeClient, initializeServer } from "./instrumentation";
import { withConfig } from "./withConfig";
import { tunnelHandler, tunnelHandlerHealthcheck } from "./tunnelHandler";

export const next = {
  initializeServer,
  initializeClient,
  captureException,
  withConfig,
  tunnelHandler,
  tunnelHandlerHealthcheck,
  SentryLib,
};
