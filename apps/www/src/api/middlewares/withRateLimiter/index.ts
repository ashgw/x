// TODO: add this to the next package or maybe make it for all fetcher serverless things
// or just inject the resut and shit
import { InternalError, logger } from "@ashgw/observability";
import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/middleware";
import { rl } from "./rl";
import { getUser } from "./user";
export interface RateLimiter {
  check: (key: string) => boolean;
}

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function withRateLimiter<R extends ContractRoute>({
  route,
}: {
  route: R;
}) {
  return createMiddleware<R, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<RateLimiterCtx>((req, res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.check(getUser({ req }))) {
        throw new InternalError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Rate limit exceeded",
        });
      }
      logger.log(req.ctx.requestedAt);
      logger.log(res.nextRequest);
      logger.log(req.ctx.rl.check("user123"));
    }),
  });
}
