import type { TsRestRequest } from "@ts-rest/serverless/next";

import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys } from "ts-roids";
import type { NextRequest } from "next/server";
import { logger } from "@ashgw/observability";

interface RateLimiter {
  put: () => unknown;
  pop: () => unknown;
}

export interface UserCtx {
  user: {
    email: string;
    name: string;
  };
}

interface __MergeTsrContextWithLocal<Ctx> {
  ctx: TsrContext["ctx"] & Ctx;
}

interface MiddlewareRespone {
  nextRequest: NextRequest;
}

type MiddlewareRequest<LocalCtx> = TsRestRequest &
  TsrContext & {
    ctx: TsrContext["ctx"] & LocalCtx;
  };

type MiddlewareFn<LocalCtx> = (
  req: MiddlewareRequest<LocalCtx>,
  res: MiddlewareRespone,
) => unknown;

export function middleware<LocalCtx extends object>(
  fn: MiddlewareFn<LocalCtx>,
) {
  return (req: MiddlewareRequest<LocalCtx>) => {
    fn(req, { nextRequest: req as unknown as NextRequest });
  };
}

export function createMiddleware<LocalCtx extends object>({
  route,
}: {
  route: Contract[Keys<Contract>];
  middleware: MiddlewareFn<LocalCtx>;
}) {
  const build = tsr.routeWithMiddleware(route)<
    TsrContext,
    {
      ctx: TsrContext["ctx"] & { ctxKey: LocalCtx };
    }
  >;

  type BuildOpts = Parameters<typeof build>[0];

  return (handler: BuildOpts["handler"]) => {
    return build({
      handler,
      middleware: [
        (req, res) => {
          logger.log(req.ctx);
          logger.log(res);
        },
      ],
    });
  };
}

export function withRateLimiter<Route extends Contract[Keys<Contract>]>({
  route,
}: {
  route: Route;
}) {
  return createMiddleware<RateLimiter>({
    route,
    middleware: (req, res) => {
      logger.log(req.ctx.pop);
      logger.log(req.ctx.requestedAt);
      logger.log(res.nextRequest);
    },
  });
}

export interface TsrContextWithRateLimiter {
  ctx: TsrContext["ctx"] & { rl: RateLimiter };
}

// TODO: also abstract this a sa middleware builder basicaly that's too cool and easy
export function withRateLimiter2<R extends Contract[Keys<Contract>]>({
  route,
}: {
  route: R;
}) {
  const build = tsr.routeWithMiddleware(route)<
    TsrContext,
    TsrContextWithRateLimiter
  >;
  type BuildOpts = Parameters<typeof build>[0];
  return (handler: BuildOpts["handler"]) =>
    build({
      // TODO: actually implement it
      middleware: [
        middleware((req, res) => {
          req.ctx.rl.put = [].push;
          logger.log(res);
        }),
      ],
      handler,
    });
}
