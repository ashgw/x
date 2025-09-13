import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import { windowToSeconds } from "./window";
import type { RlWindow } from "./window";
import type { SequentialMiddleware } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";

interface RateLimiterCtx {
  rl: RateLimiter;
}

export function rateLimiter({
  limit,
}: {
  limit: { every: RlWindow };
}): SequentialMiddleware<RateLimiterCtx> {
  const { rl } = createRateLimiter(limit.every);
  const mw = middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
    if (!req.ctx.rl.canPass(getFingerprint({ req }))) {
      return middlewareResponse.errors.tooManyRequests({
        body: {
          message: `You're limited for the next ${limit.every}`,
        },
        retryAfterSeconds: windowToSeconds(limit.every),
      });
    }
    req.ctx.rl = rl; // we need to explicitly set the context here so it sticks
  });
  return {
    mw,
    ctx: { rl },
  };
}
