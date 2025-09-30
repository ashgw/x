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

const rlQ = createLimiter({
  kind: "quota",
  limit: 1,
  window: "1s",
});

const rlI = createLimiter({
  kind: "interval",
  interval: "1s",
});

export function rateLimiter(input: RateLimitOptions) {
  if (input.kind === "interval") {
    rlI.update(input.limit.every);
  } else {
    rlQ.update({
      limit: input.limit.hits,
      window: input.limit.every,
    });
  }
  const allow =
    input.kind === "interval" ? rlI.allow.bind(rlI) : rlQ.allow.bind(rlQ);

  return middlewareFn<GlobalContext, RateLimiterCtx>(async (req, _res) => {
    const pass = await allow(getFingerprint({ req }));
    if (!pass.allowed) {
      return middlewareResponse.errors.tooManyRequests({
        body: {
          message: `You're limited for the next ${input.limit.every}`,
        },
        retryAfterSeconds: pass.retryAfterMs / 1000,
      });
    }
    return {
      ctx: {
        rl: {
          every: input.limit.every,
          kind: input.kind,
        },
      },
    };
  });
}
