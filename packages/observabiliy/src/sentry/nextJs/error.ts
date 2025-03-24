import { captureException as sentryCaptureException } from "@sentry/nextjs";

import { log } from "../../log";

/**
 * Captures an exception and logs the error message, sends it to Sentry and returns it.
 *
 * @returns A string message describing the error.
 */
export const captureException = (error: unknown): string => {
  let message = "An error occurred";

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = error.message as string;
  } else {
    message = String(error);
  }
  try {
    sentryCaptureException(error);
    log.error(`Parsing error: ${message}`);
  } catch (newError) {
    console.error("Error parsing error:", newError);
  }
  return message;
};
