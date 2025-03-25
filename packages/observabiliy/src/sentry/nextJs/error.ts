import { captureException as sentryCaptureException } from "@sentry/nextjs";

import { logger } from "../../log";

type Exception = Parameters<typeof sentryCaptureException>[0];
type Hint = Parameters<typeof sentryCaptureException>[1];

/**
 * Captures an exception and logs the error message, sends it to Sentry and returns the strinf message.
 *
 * @returns A string message describing the error.
 */
export const captureException = ({
  message,
  error,
  hint,
}: {
  message?: string;
  error: Exception;
  hint?: Hint;
}): string => {
  const errorMessagePrefix = message ?? "An error occurred";
  const errorMessage = extractErrorMessage(error);
  try {
    sentryCaptureException(error, hint);
    logger.error(`${errorMessagePrefix}: ${errorMessage}`);
  } catch (ce) {
    logger.error("CANNOT CAPTURE EXCEPTION:", ce);
  }
  return errorMessagePrefix;
};

const extractErrorMessage = (exception: Exception): string => {
  if (exception instanceof Error) {
    return exception.message;
  } else if (
    exception &&
    typeof exception === "object" &&
    "message" in exception
  ) {
    return exception.message as string;
  }
  return String(exception);
};
