import { z } from "zod";

export const ERROR_CODES = [
  "UPSTREAM_ERROR",
  "INTERNAL_ERROR",
  "BAD_REQUEST",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "CONFLICT",
  "TIMEOUT",
  "TOO_MANY_REQUESTS",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * Base error payload that all error responses should follow.
 * - `code` is machine readable
 * - `message` is for humans
 * - `details` can hold extra context, do not put secrets here
 */
export const baseErrorSchema = z.object({
  code: z.enum(ERROR_CODES).describe("Stable, machine-parseable error code"),
  message: z.string().min(1).max(1000).describe("Human readable"),
  details: z.record(z.unknown()).optional().describe("Optional extra context"),
});

export type BaseError = z.infer<typeof baseErrorSchema>;

interface BuilderOpts {
  describe?: string;
}

/** Default descriptions to keep OpenAPI text useful without repetition. */
function defaultDesc(code: ErrorCode): string {
  switch (code) {
    case "UNAUTHORIZED":
      return "Not authenticated";
    case "FORBIDDEN":
      return "Insufficient privileges";
    case "BAD_REQUEST":
      return "Validation failed or malformed input";
    case "NOT_FOUND":
      return "Resource not found";
    case "CONFLICT":
      return "State conflict";
    case "TIMEOUT":
      return "Request or upstream timed out";
    case "TOO_MANY_REQUESTS":
      return "Rate limited";
    case "UPSTREAM_ERROR":
      return "Upstream error";
    case "INTERNAL_ERROR":
    default:
      return "Internal error";
  }
}

/**
 * Builder that locks `code` to a literal and adds a description.
 */
function withCode<C extends ErrorCode>(code: C, opts?: BuilderOpts) {
  return baseErrorSchema
    .extend({ code: z.literal(code) })
    .describe(opts?.describe ?? defaultDesc(code));
}

/**
 * Error schema factory. Each function returns a zod schema with a fixed `code`.
 *
 * Example:
 * ```ts
 *   responses: {
 *     401: httpErrorSchema.unauthorized(),
 *     500: httpErrorSchema.internal(),
 *   }
 * ```
 */
export const httpErrorSchema = {
  badRequest: (opts?: BuilderOpts) => withCode("BAD_REQUEST", opts),
  unauthorized: (opts?: BuilderOpts) => withCode("UNAUTHORIZED", opts),
  forbidden: (opts?: BuilderOpts) => withCode("FORBIDDEN", opts),
  notFound: (opts?: BuilderOpts) => withCode("NOT_FOUND", opts),
  conflict: (opts?: BuilderOpts) => withCode("CONFLICT", opts),
  timeout: (opts?: BuilderOpts) => withCode("TIMEOUT", opts),
  tooManyRequests: (opts?: BuilderOpts) => withCode("TOO_MANY_REQUESTS", opts),
  internal: (opts?: BuilderOpts) => withCode("INTERNAL_ERROR", opts),
  upstream: (opts?: BuilderOpts) => withCode("UPSTREAM_ERROR", opts),
};
