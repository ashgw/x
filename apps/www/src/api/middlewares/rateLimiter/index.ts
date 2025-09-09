import { createMiddleware } from "~/@ashgw/ts-rest/middleware";
import { middlewareFn } from "~/@ashgw/ts-rest/middleware";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import { middlewareResponse } from "~/@ashgw/ts-rest/middleware/response";
import type { ContractRoute } from "~/api/contract";
import type { Keys } from "ts-roids";

export type GetContactRoute<C> = C[Keys<C>];

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
  return createMiddleware<Route, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;
      if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
        return middlewareResponse.error({
          status: 403,
          body: {
            code: "FORBIDDEN",
            message: `You're limited for the next ${limit.every}`,
          },
        });
      }
    }),
  });
}
