import { db } from "@ashgw/db";
import type { GlobalContext } from "../context";
import { logger } from "@ashgw/observability";
import type {
  ResponseHandlerResponse,
  ResponseHandlerResquest,
} from "~/@ashgw/ts-rest/handler";
import { createGlobalRequestMiddleware } from "~/@ashgw/ts-rest";

export const setupRequestMiddleware = () =>
  createGlobalRequestMiddleware<GlobalContext>((request) => {
    request.ctx = { requestedAt: new Date(), db };
  });

// TODO: fix this shit and make it createGlobalResponseMiddleware
// reference the fn file for more info how
export const setupResponseHandlers = (
  _res: ResponseHandlerResponse,
  req: ResponseHandlerResquest<GlobalContext>,
) => {
  logger.log(
    "[REST] took",
    new Date().getTime() - req.ctx.requestedAt.getTime(),
    "ms",
  );
};
