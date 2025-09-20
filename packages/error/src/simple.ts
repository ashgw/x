import { AppError } from "./error";
import type { AppCode } from "./codes";
import { E } from "./factory";
import { toHttp, toHttpFromUnknown } from "./http";
import { toTrpc, toTrpcFromUnknown, type TRPCErrorCtor } from "./trpc";

type Meta = Readonly<Record<string, unknown>>;

/** Build an AppError quickly without importing the whole class. */
export function err(
  code: AppCode,
  message?: string,
  meta?: Meta,
  cause?: unknown,
): AppError {
  return new AppError({ code, message, meta, cause });
}

/** Map unknown or AppError to REST status + body. Single function you call in REST handlers. */
export function httpFrom(u: unknown): ReturnType<typeof toHttpFromUnknown> {
  return toHttpFromUnknown(u);
}

/** Map unknown or AppError to TRPCError using the provided TRPCError ctor. */
export function trpcFrom<TCtor extends TRPCErrorCtor<string>>(
  ctor: TCtor,
  u: unknown,
) {
  // If user already threw AppError, map directly. Otherwise normalize first.
  return u instanceof AppError ? toTrpc(ctor, u) : toTrpcFromUnknown(ctor, u);
}

// Re-export E so callers only import from one place
export { E, AppError };
