import type { TsRestRequest, TsRestResponse } from "@ts-rest/serverless/next";
import { tsr } from "@ts-rest/serverless/next";
import { db } from "@ashgw/db";
import type { TsrContext } from "../context";
import { logger } from "@ashgw/observability";

export const setupGlobalRequestMiddleware = () =>
  tsr.middleware<TsrContext>((request) => {
    request.ctx = { requestedAt: new Date(), db };
  });

export type GobalRequest = TsRestRequest & TsrContext;
export type GlobalResponse = TsRestResponse;

export const setupGlobalResponseMiddleware = (
  _res: GlobalResponse,
  req: GobalRequest,
) => {
  logger.log(
    "[REST] took",
    new Date().getTime() - req.ctx.requestedAt.getTime(),
    "ms",
  );
};
