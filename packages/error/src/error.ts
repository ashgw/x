import type { AppCode } from "./codes";

interface UpstreamMeta {
  service: string;
  operation: string;
}

interface InternalMeta {
  service: string;
  op: string;
}

interface Meta extends Readonly<Record<string, unknown>> {
  upstream?: UpstreamMeta;
  internal?: InternalMeta;
}

export interface AppErrorOptions {
  readonly code: AppCode;
  readonly message?: string;
  readonly cause?: unknown;
  readonly meta?: Meta;
  readonly exposeMessage?: boolean;
}

export class AppError extends Error {
  public readonly code: AppCode;
  public override readonly cause?: unknown;
  public readonly meta?: Readonly<Record<string, unknown>>;
  public readonly exposeMessage: boolean;

  constructor(opts: AppErrorOptions) {
    super(opts.message ?? opts.code, { cause: opts.cause });
    this.name = "AppError";
    this.code = opts.code;
    this.cause = opts.cause;
    this.meta = opts.meta;
    this.exposeMessage = opts.exposeMessage ?? true;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON(): {
    name: "AppError";
    code: AppCode;
    message: string;
    meta?: Record<string, unknown>;
  } {
    return {
      name: "AppError",
      code: this.code,
      message: this.message,
      ...(this.meta ? { meta: { ...this.meta } } : {}),
    };
  }

  static fromUnknown(
    u: unknown,
    fallback: {
      code: AppCode;
      message?: string;
      meta?: Readonly<Record<string, unknown>>;
    } = { code: "INTERNAL" },
  ): AppError {
    if (u instanceof AppError) return u;
    if (u instanceof Error) {
      return new AppError({
        code: fallback.code,
        message: u.message,
        cause: u,
        meta: fallback.meta,
        exposeMessage: false,
      });
    }
    return new AppError({
      code: fallback.code,
      message: String(u),
      cause: u,
      meta: fallback.meta,
      exposeMessage: false,
    });
  }
}
