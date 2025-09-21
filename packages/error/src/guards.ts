import { AppError } from "./error";
import type { AppCode } from "./codes";

export function isAppError(e: unknown): e is AppError {
  return e instanceof AppError && e.name === "AppError";
}

export function ensureAppError(e: unknown, code: AppCode = "INTERNAL"): AppError {
  return AppError.fromUnknown(e, { code });
}
