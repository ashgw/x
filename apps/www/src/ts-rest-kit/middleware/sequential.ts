import type { EmptyObject } from "ts-roids";
import type { GlobalTsrContext } from "../ctx";
import type {
  MiddlewareRequest,
  MiddlewareRespone,
  SequentialItem,
  SequentialMiddleware,
} from "./types";
import type { AppRoute } from "@ts-rest/core";
import { createRouteMiddleware } from "./create";
import { middlewareFn } from "./fn";

// shallow-merge helper for LocalCtx objects, keep LocalCtx flat for speed */
function mergeCtx<A extends object, B extends object>(a: A, b: B): A & B {
  return Object.assign({}, a, b);
}

type AnySequentialMiddlewares = SequentialItem<GlobalTsrContext, unknown>[];

/**
 * Immutable builder. Each `.use(...)` returns a fresh builder that accumulates:
 * - a LocalCtx fragment to be merged into `req.ctx`
 * - a middleware function that can short-circuit with a Response
 *
 * Execution model:
 * - At `.route(route)` time we pre-merge LocalCtx fragments once
 * - At request time we augment `req.ctx` with that merged locals object
 * - We then call each middleware in FIFO order until one returns a Response
 *
 * Typical usage:
 *```ts
 *   const adminProtectedRoute = middleware()
 *     .use(authed())
 *     .use(rateLimiter({ limit: { every: "10s" } }));
 *
 *   export const adminRoute = adminProtectedRoute.route({ route: contract.admin });
 *   export const router = createRouterWithContext(contract)<GlobalContext>({
 *     admin: adminRoute(async ({ ctx, body }) => ({ status: 204, body: undefined })),
 *   });
 * ```
 * Pattern example:
 *```ts
 *   export const adminStack = middlware()
 *     .use(authed())
 *     .use(rateLimiter({ limit: { every: "10s" } }));
 *
 *   export const adminRoute = adminStack.route({ route: contract.admin });
 *   export const router = createRouterWithContext(contract)<GlobalContext>({
 *     admin: adminRoute(async ({ ctx }) => ({ status: 204, body: undefined })),
 *   });
 *```
 *
 */
export function middleware<
  Gtx extends GlobalTsrContext,
  AccCtx extends object = EmptyObject,
>(initial?: AnySequentialMiddlewares) {
  // keep an immutable chain so every .use returns a fresh builder
  const chain: AnySequentialMiddlewares = initial ? initial.slice() : [];

  return {
    /** Add one middleware that contributes LocalCtx and may short-circuit with a Response. */
    use<G extends GlobalTsrContext, C extends object>(m: SequentialItem<G, C>) {
      const nextChain: AnySequentialMiddlewares = chain.concat(
        m as unknown as SequentialItem<GlobalTsrContext, unknown>,
      );
      // widen global context requirements as middlewares are added
      return middleware<Gtx & G, AccCtx & C>(nextChain);
    },

    // bind the accumulated chain to a specific contract route.
    route<Route extends AppRoute>(route: Route) {
      // compute final merged LocalCtx once, then assign into req.ctx per request
      const finalCtx = chain.reduce<Record<string, unknown>>(
        (acc, item) => {
          if (typeof item === "function") return acc;
          const local = (
            item as SequentialMiddleware<
              GlobalTsrContext,
              Record<string, unknown>
            >
          ).ctx;
          return mergeCtx(acc, local);
        },
        {} as Record<string, unknown>,
      );

      return createRouteMiddleware<Route, Gtx, AccCtx>({
        route,
        middlewareFn: middlewareFn<Gtx, AccCtx>((req, res) => {
          // augment existing ctx with our merged locals
          Object.assign(req.ctx, finalCtx);

          // run in FIFO. If any returns a Response, bubble it up immediately.
          for (const item of chain) {
            type AnyFn = (
              rq: MiddlewareRequest<Gtx, unknown>,
              rs: MiddlewareRespone,
            ) => unknown;
            const fn: AnyFn =
              typeof item === "function"
                ? (item as AnyFn)
                : (
                    item as unknown as {
                      mw: AnyFn;
                    }
                  ).mw;
            const out = fn(req, res);
            if (out instanceof Response) return out;
            if (typeof out === "object" && out && "ctx" in out) {
              Object.assign(req.ctx as object, (out as { ctx: object }).ctx);
            }
          }
        }),
      });
    },
  };
}
