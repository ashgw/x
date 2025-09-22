import type { NextRequest } from "next/server";
import type { GlobalTsrContext } from "../ctx";
import type { TsRestRequest, TsRestResponse } from "@ts-rest/serverless/next";

/**
 * At runtime `req.ctx` is a live object. This type composes the global
 * context with a LocalCtx fragment produced by the middleware chain.
 */
export type MergeTsrContextWith<
  Gtx extends GlobalTsrContext,
  LocalCtx,
> = Gtx & {
  ctx: Gtx["ctx"] & LocalCtx;
};

/**
 * The request object shape that middleware and handlers receive.
 * It includes the typed `ctx` plus the underlying TsRestRequest fields.
 */
export type MiddlewareRequest<
  Gtx extends GlobalTsrContext,
  LocalCtx,
> = TsRestRequest & Gtx & MergeTsrContextWith<Gtx, LocalCtx>;

/** Minimal wrapper to expose the raw NextRequest when you need it. */
export interface MiddlewareRespone {
  nextRequest: NextRequest;
}

/** Request shape for Global response handlers. */
export type ResponseHandlerRequest<Gtx extends GlobalTsrContext> =
  TsRestRequest & Gtx;

/** Response wrapper from ts-rest serverless adapter. */
export type ResponseHandlerResponse = TsRestResponse;

/**
 * Return:
 * - Response to short-circuit
 * - void or undefined to continue
 */
export type MiddlewareReturn<LocalCtx> =
  | void
  | Response
  | {
      ctx: LocalCtx;
    };

export type MiddlewareFn<Gtx extends GlobalTsrContext, LocalCtx> = (
  req: MiddlewareRequest<Gtx, LocalCtx>,
  res: MiddlewareRespone,
) => MiddlewareReturn<LocalCtx>;

/** Post-response hook signature. */
export type ResponseHandlersFn<FnReturntype, Gtx extends GlobalTsrContext> = (
  res: ResponseHandlerResponse,
  req: ResponseHandlerRequest<Gtx>,
) => FnReturntype;

/**
 * SequentialMiddleware
 *
 * Pair of:
 * - `ctx`: LocalCtx fragment to merge once per route
 * - `mw`: the function to run on each request
 */
export interface SequentialMiddleware<Gtx extends GlobalTsrContext, LocalCtx> {
  ctx: LocalCtx;
  mw: MiddlewareFn<Gtx, LocalCtx>;
}

/** Convenience alias for middlewares that only provide a function (no static ctx). */
export type SequentialMiddlewareFn<
  Gtx extends GlobalTsrContext,
  LocalCtx,
> = MiddlewareFn<Gtx, LocalCtx>;

/** Union accepted by the sequential builder: pair or function-only. */
export type SequentialItem<Gtx extends GlobalTsrContext, LocalCtx> =
  | SequentialMiddleware<Gtx, LocalCtx>
  | SequentialMiddlewareFn<Gtx, LocalCtx>;
