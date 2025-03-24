import { captureException as sentryCaptureException } from "@sentry/nextjs";

import { log } from "../log";

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
