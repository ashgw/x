import { middlewareResponse, middlewareFn } from "~/ts-rest-kit";
import { createLimiter } from "limico";
import type { RlWindow } from "limico";
import type { GlobalContext } from "~/ts-rest/context";
import { getFingerprint } from "@ashgw/security";

type RlKind = "interval" | "quota";
interface RateLimiterCtx {
  rl: {
    every: RlWindow;
    kind: RlKind;
  };
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
        hits: number;
      };
    };

export function rateLimiter({ limiter }: { limiter: RateLimitOptions }) {
  const rl =
    limiter.kind === "interval"
      ? createLimiter({
          kind: "interval",
          interval: limiter.limit.every,
        })
      : createLimiter({
          kind: "quota",
          limit: limiter.limit.hits,
          window: limiter.limit.every,
          burst: "20",
          lockRetries: false,
        });

  return middlewareFn<GlobalContext, RateLimiterCtx>(async (req, _res) => {
    const pass = await rl.allow(getFingerprint({ req }));
    if (!pass.allowed) {
      return middlewareResponse.errors.tooManyRequests({
        body: {
          message: `You're limited for the next ${limiter.limit.every}`,
        },
        retryAfterSeconds: pass.retryAfterMs / 1000,
      });
    }
    return {
      ctx: {
        rl: {
          every: limiter.limit.every,
          kind: limiter.kind,
        },
      },
    };
  });
}
