import type { SequentialMiddleware } from "~/@ashgw/ts-rest";
import { middlewareResponse, middlewareFn } from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";
import { RateLimiterService } from "@ashgw/rate-limiter";
import type { RlWindow } from "@ashgw/rate-limiter";

interface RateLimiterCtx {
  rateLimitWindow: RlWindow;
}

export function rateLimiter({
  limit,
}: {
  limit: { every: RlWindow };
}): SequentialMiddleware<RateLimiterCtx> {
  const rateLimitWindow = limit.every;
  const rl = new RateLimiterService(limit.every);
  const mw = middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
    if (!rl.canPass(rl.fp({ req }))) {
      return middlewareResponse.errors.tooManyRequests({
        body: {
          message: `You're limited for the next ${limit.every}`,
        },
        retryAfterSeconds: rl.windowToSeconds(limit.every),
      });
    }
    req.ctx.rateLimitWindow = rateLimitWindow; // we need to explicitly set the context here so it sticks
  });
  return {
    mw,
    ctx: { rateLimitWindow },
  };
}
