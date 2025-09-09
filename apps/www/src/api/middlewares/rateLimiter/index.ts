import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/middleware";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import { middlewareResponse } from "~/@ashgw/ts-rest/middleware/response";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiterMiddleware<R extends ContractRoute>({
  route,
  limit,
}: {
  route: R;
  limit: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(limit.every);
  return createMiddleware<R, RateLimiterCtx>({
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
