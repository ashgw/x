// TODO: add this to the next package or maybe make it for all fetcher serverless things
// or just inject the resut and shit
import type { TsRestRequest } from "@ts-rest/serverless/next";

import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys } from "ts-roids";
import type { NextRequest } from "next/server";
import { logger } from "@ashgw/observability";

type CRoute = Contract[Keys<Contract>];

type MergeTsrContextWith<C> = TsrContext & {
  ctx: TsrContext["ctx"] & C;
};

interface MiddlewareRespone {
  nextRequest: NextRequest;
}

type MiddlewareRequest<LocalCtx> = TsRestRequest &
  TsrContext &
  MergeTsrContextWith<LocalCtx>;

type MiddlewareFn<LocalCtx> = (
  req: MiddlewareRequest<LocalCtx>,
  res: MiddlewareRespone,
) => unknown;

export function middlewareFn<LocalCtx extends object>(
  fn: MiddlewareFn<LocalCtx>,
) {
  return (req: MiddlewareRequest<LocalCtx>) => {
    fn(req, { nextRequest: req as unknown as NextRequest });
  };
}

export function createMiddleware<R extends CRoute, LocalCtx extends object>({
  route,
  middlewareFn,
}: {
  route: R;
  middlewareFn: MiddlewareFn<LocalCtx>;
}) {
  const build = tsr.routeWithMiddleware(route)<
    TsrContext,
    MergeTsrContextWith<LocalCtx>
  >;

  type BuildOpts = Parameters<typeof build>[0];

  return (handler: BuildOpts["handler"]) => {
    return build({
      handler,
      middleware: [middlewareFn],
    });
  };
}

interface RateLimiter {
  put: () => unknown;
  pop: () => unknown;
}

export function withRateLimiter<R extends CRoute>({ route }: { route: R }) {
  return createMiddleware<R, RateLimiter>({
    route,
    middlewareFn: middlewareFn<RateLimiter>((req, res) => {
      logger.log(req.ctx.pop);
      logger.log(req.ctx.requestedAt);
      logger.log(res.nextRequest);
    }),
  });
}
