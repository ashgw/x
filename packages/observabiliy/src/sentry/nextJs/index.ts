import * as SentryLib from "@sentry/nextjs";

import { captureException } from "./captureException";
import { init } from "./init";
import { withConfig } from "./withConfig";

export const next = {
  init,
  captureException,
  withConfig,
  SentryLib,
};
