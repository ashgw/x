import { middlewareResponse, middlewareFn } from "ts-rest-kit";
import { RateLimiterService } from "@ashgw/rate-limiter";
import type { RlWindow } from "@ashgw/rate-limiter";
import type { GlobalContext } from "~/ts-rest/context";
interface RateLimiterCtx {
  rateLimitWindow: RlWindow;
}

//  TODO: use a presistent kv here since lambdas don't presist shit
export function rateLimiter({ limit }: { limit: { every: RlWindow } }) {
  const rl = new RateLimiterService(limit.every);
  return middlewareFn<GlobalContext, RateLimiterCtx>((req, _res) => {
    if (!rl.canPass(rl.fp({ req }))) {
      return middlewareResponse.errors.tooManyRequests({
        body: {
          message: `You're limited for the next ${limit.every}`,
        },
        retryAfterSeconds: rl.windowToSeconds(limit.every),
      });
    }
    return {
      ctx: {
        rateLimitWindow: limit.every,
      },
    };
  });
}
