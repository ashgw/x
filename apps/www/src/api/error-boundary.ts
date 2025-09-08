import { logger, monitor } from "@ashgw/observability";
import { tsr } from "@ts-rest/serverless/next";
import type { ContractRoute } from "./contract";
import type { TsrContext } from "~/api/context";
import { InternalError as ObsInternalError } from "@ashgw/observability";
import type { httpErrorRo } from "./schemas/ros";

type HttpErrorCode = httpErrorRo["code"];

function toHttpCode(code: string): HttpErrorCode {
  switch (code) {
    case "BAD_REQUEST":
    case "UNAUTHORIZED":
    case "FORBIDDEN":
    case "NOT_FOUND":
    case "CONFLICT":
    case "UPSTREAM_ERROR":
    case "INTERNAL_ERROR":
      return code;
    case "INTERNAL_SERVER_ERROR":
    default:
      return "INTERNAL_ERROR";
  }
}

export function routeWithErrorBoundary<
  R extends ContractRoute,
  LocalCtx extends object,
>(route: R) {
  const build = tsr.routeWithMiddleware(route)<
    TsrContext,
    TsrContext & { ctx: TsrContext["ctx"] & LocalCtx }
  >;

  type BuildOpts = Parameters<typeof build>[0];
  type RouteResponse = Awaited<ReturnType<BuildOpts["handler"]>>;

  function mapError(err: Error): RouteResponse {
    if (err instanceof ObsInternalError) {
      const status = err.statusCode;
      const code = toHttpCode(String(err.code));
      return {
        status: status >= 400 && status <= 599 ? status : 500,
        body: { code, message: err.message },
      } as RouteResponse;
    }

    logger.error("Unhandled error", { err });
    monitor.next.captureException({ error: err });

    return {
      status: 500,
      body: { code: "INTERNAL_ERROR", message: "Internal error" },
    } as RouteResponse;
  }

  return (opts: BuildOpts) =>
    build({
      ...opts,
      handler: async (req, ctx) => {
        try {
          return await opts.handler(req, ctx); // <- pass both arguments
        } catch (err) {
          return mapError(err as Error);
        }
      },
    });
}
