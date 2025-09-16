import { db } from "@ashgw/db";
import type { GlobalContext } from "../context";
import { logger } from "@ashgw/logger";
import {
  createGlobalRequestMiddleware,
  responseHandlersFn,
} from "~/@ashgw/ts-rest";

const createGlobalContext = createGlobalRequestMiddleware<GlobalContext>(
  (request) => {
    request.ctx = { requestedAt: new Date(), db };
  },
);

export const setupRequestMiddleware = () => createGlobalContext;

export const setupResponseHandlers = responseHandlersFn<void, GlobalContext>(
  (_res, req) => {
    logger.info("[REST] took %sms", {
      requestedAt: req.ctx.requestedAt,
      took: new Date().getTime() - req.ctx.requestedAt.getTime(),
    });
  },
);
