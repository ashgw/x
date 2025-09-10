import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import {
  middlewareResponse,
  middlewareFn,
  createRouteMiddleware,
} from "~/@ashgw/ts-rest";
import type { ContractRoute } from "~/api/contract";
import type { GlobalContext } from "~/api/context";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiterMiddleware<Route extends ContractRoute>({
  route,
  limit,
}: {
  route: Route;
  limit: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(limit.every);
  return createRouteMiddleware<Route, GlobalContext, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
        return middlewareResponse.error({
          status: 403,
          body: {
            code: "FORBIDDEN",
            message: `You're limited for the next ${req.ctx.rl.every}`,
          },
        });
      }
    }),
  });
}
