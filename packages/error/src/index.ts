const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const;

type ErrorCode = keyof typeof ERROR_CODES;

interface ErrorOptions {
  code: ErrorCode;
  message: string;
  cause?: unknown;
}

export class InternalError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public override readonly cause?: unknown;

  constructor({ code, message, cause }: ErrorOptions) {
    super(message);
    this.name = "InternalError";
    this.code = code;
    this.statusCode = ERROR_CODES[code];
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }
}
