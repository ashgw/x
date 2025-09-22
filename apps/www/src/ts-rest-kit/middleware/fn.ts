import type { NextRequest } from "next/server";

import type {
  MiddlewareFn,
  MiddlewareRequest,
  ResponseHandlerResponse,
  ResponseHandlerRequest,
  ResponseHandlersFn,
} from "./types";
import type { GlobalTsrContext } from "../ctx";

/**
 * Adapter to build composable middleware with a clean signature.
 *
 * How:
 * ```ts
 *   const mw = middlewareFn<AppContext, { userId: string }>((req) => {
 *     if (!req.ctx.user) {
 *        return middlewareResponse.errors.unauthorized({ message: "sign in" });
 *     }
 *     req.ctx.userId = req.ctx.user.id; // **IMPORTANT:** explicitly set context!
 *   });
 * ```
 * If you return a `Response`, the chain stops. Return void to continue.
 */
export function middlewareFn<
  Gtx extends GlobalTsrContext,
  LocalCtx extends object,
>(fn: MiddlewareFn<Gtx, LocalCtx>) {
  return (req: MiddlewareRequest<Gtx, LocalCtx>) => {
    return fn(req, { nextRequest: req as unknown as NextRequest });
  };
}

/**
 * Post-response hook adapter. Use this to log, emit metrics, or mutate headers
 * right before the response is finalized.
 *
 * Example:
 *   export const setupResponseHandlers = responseHandlersFn<void, GlobalContext>(
 *     (res, req) => logger.info("handled", { path: req.url, status: res.status })
 *   );
 */
export function responseHandlersFn<Rtype, Gtx extends GlobalTsrContext>(
  fn: ResponseHandlersFn<Rtype, Gtx>,
) {
  return (res: ResponseHandlerResponse, req: ResponseHandlerRequest<Gtx>) => {
    return fn(res, req);
  };
}
