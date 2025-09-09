// TODO: add this to the next package or maybe make it for all fetcher serverless things
import type { TsRestRequest } from "@ts-rest/serverless/next";
import { tsr } from "@ts-rest/serverless/next";
import type { Contract } from "~/api/contract";
import type { TsrContext } from "~/api/context";
import type { Keys, MaybeUndefined } from "ts-roids";
import { NextResponse } from "next/server";
import type { HttpErrorRo } from "./schemas/ros";
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

// TODO: make this accept a zod schema for body & headers
export interface MwUnion {
  status: number;
  body: MaybeUndefined<unknown>;
  headers?: Record<string, string>;
}

/** Normalize a union or Response into a NextResponse for ts-rest short-circuit */
function generic(x: MwUnion): Response | void {
  const { status, body, headers } = x;
  return typeof body === "undefined"
    ? new NextResponse(null, { status, headers })
    : NextResponse.json(body as unknown, { status, headers });
}

const ERROR_STATUS_MAP = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  UPSTREAM_ERROR: 502,
} as const;

type ErrorStatusMap = typeof ERROR_STATUS_MAP;

type ErrorInput = {
  [C in Keys<ErrorStatusMap>]: {
    body: Omit<HttpErrorRo, "code"> & { code: C };
    status?: ErrorStatusMap[C];
  };
}[Keys<ErrorStatusMap>];

function middlewareErrorResponse({ body, status }: ErrorInput) {
  const code = body.code;
  const fallback = ERROR_STATUS_MAP[code];

  return generic({
    status: status ?? fallback,
    body: { ...body, code },
  });
}

export const middlewareResponse = {
  generic,
  error: middlewareErrorResponse,
};
