import { captureException as sentryCaptureException } from "@sentry/nextjs";

import { logger } from "../../log";

type Exception = Parameters<typeof sentryCaptureException>[0];
type Hint = Parameters<typeof sentryCaptureException>[1];

/**
 * Captures an exception and logs the error message, sends it to Sentry and returns the string message.
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
  const errorMessage = extractErrorMessage(error);
  const userProvivedErrorMessage = message ?? errorMessage;
  try {
    sentryCaptureException(error, hint);
    logger.error(`${userProvivedErrorMessage}`);
  } catch (ce) {
    logger.error("CANNOT CAPTURE EXCEPTION:", ce);
  }
  return userProvivedErrorMessage;
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
