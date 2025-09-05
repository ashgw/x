import type { ErrorRo } from "./schemas";
export type ErrorCode = ErrorRo["code"];
type Status = 400 | 401 | 403 | 404 | 424 | 500;

export class HttpError extends Error {
  readonly status: Status;
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    status: Status,
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  toResponse() {
    return {
      status: this.status,
      body: {
        code: this.code,
        message: this.message,
        ...(this.details ? { details: this.details } : {}),
      },
    } as const;
  }
}

export const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError;

export const badRequest = (
  message = "Bad request",
  details?: Record<string, unknown>,
) => new HttpError(400, "BAD_REQUEST", message, details);

export const unauthorized = (
  message = "Unauthorized",
  details?: Record<string, unknown>,
) => new HttpError(401, "UNAUTHORIZED", message, details);

export const forbidden = (
  message = "Forbidden",
  details?: Record<string, unknown>,
) => new HttpError(403, "FORBIDDEN", message, details);

export const notFound = (
  message = "Not found",
  details?: Record<string, unknown>,
) => new HttpError(404, "NOT_FOUND", message, details);

export const upstreamError = (
  message = "Upstream error",
  details?: Record<string, unknown>,
) => new HttpError(424, "UPSTREAM_ERROR", message, details);

export const internal = (
  message = "Internal error",
  details?: Record<string, unknown>,
) => new HttpError(500, "INTERNAL_ERROR", message, details);
