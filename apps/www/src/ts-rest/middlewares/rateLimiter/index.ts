import type { EmptyObject } from "ts-roids";
import { getFingerprint } from "./getFingerprint";
import type { RateLimiter } from "./rl";
import { createRateLimiter } from "./rl";
import type { RlWindow } from "./window";
import type {
  SequentialMiddlewareRo,
  SequentialMiddlewareRos,
} from "~/@ashgw/ts-rest";
import {
  middlewareResponse,
  middlewareFn,
  createRouteMiddleware,
} from "~/@ashgw/ts-rest";
import type { GlobalContext } from "~/ts-rest/context";
import type { AppRoute } from "@ts-rest/core";

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
      req.ctx.user = user; // we need to set the context here too
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

/**
 * TODO: document this function even more
 * Composable middleware stack:
 *
 * usage:
 *   const stack = routeMiddlewares()
 *     .use(authed())
 *     .use(rateLimiter({ limit: { every: "10s" } }));
 *
 *   export const withAuthAndRateLimit = stack.route({ route });
 *
 * The returned value from `route({ route })` is exactly what `createRouteMiddleware(...)` returns,
 * so you use it the same way to wrap a handler.
 */
export function routeMiddlewares<AccCtx extends object = EmptyObject>(
  initial?: Readonly<SequentialMiddlewareRos>,
) {
  // kep an immutable chain so every .use returns a fresh builder
  const chain: Readonly<SequentialMiddlewareRos> = initial ? [...initial] : [];

  function mergeCtx<A extends object, B extends object>(a: A, b: B): A & B {
    // shallow merge is enough for our LocalCtx shapes
    return Object.assign({}, a, b);
  }

  return {
    use<C extends object>(m: SequentialMiddlewareRo<C>) {
      return routeMiddlewares<AccCtx & C>([
        ...chain,
        m as SequentialMiddlewareRo<unknown>,
      ]);
    },

    route<Route extends AppRoute>({ route }: { route: Route }) {
      // compute final merged LocalCtx once, then assign into req.ctx per request
      const finalCtx = chain.reduce((acc, item) => {
        return mergeCtx(acc, item.ctx as object);
      }, {} as AccCtx);

      return createRouteMiddleware<Route, GlobalContext, AccCtx>({
        route,
        middlewareFn: middlewareFn<GlobalContext, AccCtx>((req, res) => {
          // augment existing ctx with our merged locals
          Object.assign(req.ctx as object, finalCtx as object);

          // run in FIFO. If any returns a Response/union, bubble it up immediately.
          for (const item of chain) {
            const out = (item.mw as (rq: unknown, rs: unknown) => unknown)(
              req as unknown,
              res as unknown,
            );
            if (typeof out !== "undefined") return out as Response;
          }
        }),
      });
    },
  };
}
