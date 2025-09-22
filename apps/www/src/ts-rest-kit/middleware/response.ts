import type { MaybeUndefined } from "ts-roids";
import type { BaseError } from "../schemas";
import { TsRestResponse } from "@ts-rest/serverless/next";

/**
 * Middleware response helpers for Next.js route handlers.
 * These are framework level helpers, not contract types.
 *
 * Use `middlewareResponse.errors.*` to standardize HTTP mapping across your stack.
 * Each helper populates the `code` field and chooses the right HTTP status by default.
 */

export interface MwUnion {
  status: number;
  body: MaybeUndefined<unknown>;
  headers?: Record<string, string>;
}

export const HTTP_STATUS_BY_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  UPSTREAM_ERROR: 502,
  TIMEOUT: 504,
} as const;

type ErrorCode = keyof typeof HTTP_STATUS_BY_CODE;

/**
 * generic
 *
 * Send either a JSON response when `body` is provided or a no-body response
 * when `body` is undefined. Useful to return 204 without inventing payloads.
 */
function generic(x: MwUnion): Response | void {
  const { status, body, headers } = x;
  return typeof body === "undefined"
    ? new TsRestResponse(null, { status, headers })
    : new TsRestResponse(JSON.stringify(body), { status, headers });
}

/**
 * error
 *
 * Build a consistent error response. If you do not pass `status`, the HTTP
 * status is selected from `HTTP_STATUS_BY_CODE[code]`.
 */
function error(opts: {
  body: Omit<BaseError, "code"> & { code: ErrorCode };
  status?: number;
  headers?: Record<string, string>;
}) {
  const { body, status, headers } = opts;
  const fallback = HTTP_STATUS_BY_CODE[body.code];
  return generic({
    status: status ?? fallback,
    headers,
    body: { ...body, code: body.code },
  });
}

const errors = {
  badRequest: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "BAD_REQUEST" }, ...(opts ?? {}) }),

  unauthorized: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "UNAUTHORIZED" }, ...(opts ?? {}) }),

  forbidden: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "FORBIDDEN" }, ...(opts ?? {}) }),

  notFound: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "NOT_FOUND" }, ...(opts ?? {}) }),

  conflict: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "CONFLICT" }, ...(opts ?? {}) }),

  internal: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "INTERNAL_ERROR" }, ...(opts ?? {}) }),

  upstream: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "UPSTREAM_ERROR" }, ...(opts ?? {}) }),

  timeout: (
    body: Omit<BaseError, "code">,
    opts?: { status?: number; headers?: Record<string, string> },
  ) => error({ body: { ...body, code: "TIMEOUT" }, ...(opts ?? {}) }),

  /**
   * Adds a `Retry-After` header with whole seconds as an integer string.
   */
  tooManyRequests: (opts: {
    body: Omit<BaseError, "code">;
    retryAfterSeconds: number;
    status?: number;
    headers?: Record<string, string>;
  }) => {
    const retry = Math.max(1, Math.floor(opts.retryAfterSeconds));
    return error({
      body: { ...opts.body, code: "TOO_MANY_REQUESTS" },
      status: opts.status,
      headers: { ...(opts.headers ?? {}), "Retry-After": String(retry) },
    });
  },
};

export const middlewareResponse = {
  generic,
  errors,
};
