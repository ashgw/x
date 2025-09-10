import { db } from "@ashgw/db";
import type { GlobalContext } from "../context";
import { logger } from "@ashgw/observability";
import type {
  GlobalResponseHandlerMiddlewareResponse,
  GlobalResponseHandlerMiddlewareResquest,
} from "~/@ashgw/ts-rest/middleware/types";
import { createGlobalRequestMiddleware } from "~/@ashgw/ts-rest/middleware";

export const setupGlobalRequestMiddleware = () =>
  createGlobalRequestMiddleware<GlobalContext>((request) => {
    request.ctx = { requestedAt: new Date(), db };
  });

// TODO: fix this shit and make it createGlobalResponseMiddleware
// reference the fn file for more info how
export const setupGlobalResponseMiddleware = (
  _res: GlobalResponseHandlerMiddlewareResponse,
  req: GlobalResponseHandlerMiddlewareResquest<GlobalContext>,
) => {
  logger.log(
    "[REST] took",
    new Date().getTime() - req.ctx.requestedAt.getTime(),
    "ms",
  );
};
