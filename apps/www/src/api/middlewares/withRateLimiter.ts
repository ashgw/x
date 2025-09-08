import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys } from "ts-roids";

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
      middleware: [(req) => (req.ctx.rl.pop = ["1"].pop)],
      handler,
    });
}
