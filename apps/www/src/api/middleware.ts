// TODO: add this to the next package or maybe make it for all fetcher serverless things
import type { TsRestRequest } from "@ts-rest/serverless/next";

import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys } from "ts-roids";
import type { NextRequest } from "next/server";

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

export type ContractRoute = Contract[Keys<Contract>];

export function middlewareFn<LocalCtx extends object>(
  fn: MiddlewareFn<LocalCtx>,
) {
  return (req: MiddlewareRequest<LocalCtx>) => {
    return fn(req, { nextRequest: req as unknown as NextRequest });
  };
}

export function createMiddleware<
  R extends ContractRoute,
  LocalCtx extends object,
>({ route, middlewareFn }: { route: R; middlewareFn: MiddlewareFn<LocalCtx> }) {
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
