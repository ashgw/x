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

interface AuthedContext {
  user: {
    email: string;
    name: string;
    role: "admin" | "visitor";
  } | null;
}

// TODO: document how to create a sequantial middleware
export function authed(): SequentialMiddlewareRo<AuthedContext> {
  const getUserSafe = (): AuthedContext["user"] | null => {
    if (Math.random() > 0.4) {
      return { email: "john@doe.com", name: "john", role: "admin" };
    } else return { email: "john@doe.com", name: "john", role: "admin" };
  };

  const user = getUserSafe();
  const mw = middlewareFn<GlobalContext, AuthedContext>((req, _res) => {
    if (user) {
      req.ctx.user = user; // TODO: tell the user that we always need to set the context here too
    } else {
      return middlewareResponse.error({
        body: {
          code: "UNAUTHORIZED",
          message: "Youre not authed!",
        },
      });
    }
  });
  return {
    mw,
    ctx: { user },
  };
}
