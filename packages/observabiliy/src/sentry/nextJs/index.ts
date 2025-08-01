import * as SentryLib from "@sentry/nextjs";

import { captureException } from "./captureException";
import { initializeClient, initializeServer } from "./instrumentation";
import { withConfig } from "./withConfig";

export const next = {
  initializeServer,
  initializeClient,
  captureException,
  withConfig,
  SentryLib,
};
