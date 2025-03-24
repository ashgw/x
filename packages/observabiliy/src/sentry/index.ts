import { captureException } from "./error";
import { initSentry } from "./init";

export const sentry = {
  init: initSentry,
  captureException,
};
