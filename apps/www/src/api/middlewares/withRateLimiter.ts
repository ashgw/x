// TODO: add this to the next package or maybe make it for all fetcher serverless things
// or just inject the resut and shit
import { logger } from "@ashgw/observability";
import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/middleware";

interface RateLimiterCtx {
  put: () => unknown;
  pop: () => unknown;
}

export function withRateLimiter<R extends ContractRoute>({
  route,
}: {
  route: R;
}) {
  return createMiddleware<R, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<RateLimiterCtx>((req, res) => {
      logger.log(req.ctx.pop);
      logger.log(req.ctx.requestedAt);
      logger.log(res.nextRequest);
    }),
  });
}
