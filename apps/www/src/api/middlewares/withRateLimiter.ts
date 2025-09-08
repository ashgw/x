import type { TsRestRequest } from "@ts-rest/serverless/next";

import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys } from "ts-roids";
import type { NextRequest } from "next/server";
import { logger } from "@ashgw/observability";

type MiddleWareRequest = TsRestRequest & TsrContext & TsrContextWithRateLimiter;

export function middleware(
  fn: (req: MiddleWareRequest, res: { nextRequest: NextRequest }) => void,
) {
  return (req: MiddleWareRequest) => {
    fn(req, { nextRequest: req as unknown as NextRequest });
  };
}

export function createMiddleware<
  LocalCtx extends object,
  Route extends Contract[Keys<Contract>],
>({ route, ctxKey }: { route: Route; ctxKey: string }) {
  const build = tsr.routeWithMiddleware(route)<
    TsrContext,
    {
      ctx: TsrContext["ctx"] & { ctxKey: LocalCtx };
    }
  >;
  type BuildOpts = Parameters<typeof build>[0];

  return (handler: BuildOpts["handler"]) => {
    return {
      handler,
      middleware: [(req) => (req.ctx.rl.pop = ["1"].pop)],
    };
  };
}

interface RateLimiter {
  put: () => unknown;
  pop: () => unknown;
}

export interface TsrContextWithRateLimiter {
  ctx: TsrContext["ctx"] & { rl: RateLimiter };
}

// TODO: also abstract this a sa middleware builder basicaly that's too cool and easy
export function withRateLimiter<R extends Contract[Keys<Contract>]>(route: R) {
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
