import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import type { SequentialMiddlewareRo } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiter({
  limit,
}: {
  limit: { every: RlWindow };
}): SequentialMiddlewareRo<RateLimiterCtx> {
  const { rl } = createRateLimiter(limit.every);
  const mw = middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
    req.ctx.rl = rl; // we need to set the context here so it sticks
    if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
      return middlewareResponse.error({
        status: 403,
        body: {
          code: "FORBIDDEN",
          message: `You're limited for the next ${req.ctx.rl.every}`,
        },
      });
    }
  });
  return {
    mw,
    ctx: { rl },
  };
}
