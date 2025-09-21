import { AppError } from "./error";
import type { AppCode } from "./codes";
import { E } from "./factory";
import { toHttpFromUnknown } from "./http";
import { toTrpc, toTrpcFromUnknown } from "./trpc";
import type { TRPCErrorCtor } from "./trpc";

type Meta = Readonly<Record<string, unknown>>;

/** quick way to make an apperror without importing the whole thing */
export function err(
  code: AppCode,
  message?: string,
  meta?: Meta,
  cause?: unknown,
): AppError {
  return new AppError({ code, message, meta, cause });
}

/** turns whatever error into http status + body. just call this in your rest handlers */
export function httpFrom(u: unknown): ReturnType<typeof toHttpFromUnknown> {
  return toHttpFromUnknown(u);
}

/** converts unknown or apperror to trpc error using the ctor you give it */
export function trpcFrom<TCtor extends TRPCErrorCtor<string>>(
  ctor: TCtor,
  u: unknown,
) {
  // if its already an apperror just map it, otherwize normalize first
  return u instanceof AppError ? toTrpc(ctor, u) : toTrpcFromUnknown(ctor, u);
}

// re-export E so you dont have to import from multiple places
export { E, AppError };
