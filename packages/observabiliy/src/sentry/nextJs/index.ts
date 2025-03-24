import * as SentryLib from "@sentry/nextjs";

import { captureException } from "./error";
import { init } from "./init";
import { withConfig } from "./withConfig";

export const next = {
  init,
  captureException,
  withConfig,
  lib: SentryLib,
};
