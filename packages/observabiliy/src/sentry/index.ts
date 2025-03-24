import { captureException } from "./error";
import { init } from "./init";
import { withConfig } from "./withConfig";

export const sentry = {
  init,
  captureException,
  withConfig,
};
