import { middlewareResponse, middlewareFn } from "~/ts-rest-kit";
import { createLimiter } from "limico";
import type { RlWindow } from "limico";
import type { GlobalContext } from "~/ts-rest/context";
import { getFingerprint } from "@ashgw/security";

interface RateLimiterCtx {
  rateLimitWindow: RlWindow;
}

export type RateLimitOptions =
  | {
      kind: "interval";
      limit: {
        every: RlWindow;
      };
    }
  | {
      kind: "quota";
      limit: {
        every: RlWindow;
        allowedHits: number;
      };
    };

export async function rateLimiter({ limiter }: { limiter: RateLimitOptions }) {
  const rl =
    limiter.kind === "interval"
      ? createLimiter({
          kind: "interval",
          interval: limiter.limit.every,
        })
      : createLimiter({
          kind: "quota",
          limit: limiter.limit.allowedHits,
          window: limiter.limit.every,
          burst: "20",
          lockRetries: false,
        });

  return middlewareFn<GlobalContext, RateLimiterCtx>(async (req, _res) => {
    const canPass = await rl.allow(getFingerprint({ req }));
    if (!canPass) {
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
