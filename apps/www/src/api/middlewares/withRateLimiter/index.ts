import { InternalError } from "@ashgw/observability";
import { createMiddleware } from "~/api/middleware";
import { middlewareFn } from "~/api/middleware";
import type { ContractRoute } from "~/api/contract";
import { rl } from "./rl";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";

interface RateLimiterCtx {
  rl: RateLimiter;
}

// TODO: actually implement it
export function withRateLimiter<R extends ContractRoute>({
  route,
}: {
  route: R;
}) {
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
