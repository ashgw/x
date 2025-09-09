import type { TsRestRequest, TsRestResponse } from "@ts-rest/serverless/next";
import { tsr } from "@ts-rest/serverless/next";
import { db } from "@ashgw/db";
import type { GlobalContext } from "../context";
import { logger } from "@ashgw/observability";

// TODO: abstract these tho
export const setupGlobalRequestMiddleware = () =>
  tsr.middleware<GlobalContext>((request) => {
    request.ctx = { requestedAt: new Date(), db };
  });

export type GobalRequest = TsRestRequest & GlobalContext;
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
