import { InternalError } from "@ashgw/observability";
import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/middleware";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function withRateLimiter<R extends ContractRoute>({
  route,
  block,
}: {
  route: R;
  block: { every: RlWindow };
}) {
  const { rl } = createRateLimiter(block.every);

  return createMiddleware<R, RateLimiterCtx>({
    route,
    middlewareFn: middlewareFn<RateLimiterCtx>((req, _res) => {
      req.ctx.rl = rl;

      if (!req.ctx.rl.check(getFingerprint({ req }))) {
        throw new InternalError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Rate limit exceeded",
        });
      }
    }),
  });
}
