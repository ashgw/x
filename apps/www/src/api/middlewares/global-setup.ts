import { db } from "@ashgw/db";
import type { GlobalContext } from "../context";
import { logger } from "@ashgw/observability";
import {
  createGlobalRequestMiddleware,
  responseHandlersFn,
} from "~/@ashgw/ts-rest";

export const setupRequestMiddleware = () =>
  createGlobalRequestMiddleware<GlobalContext>((request) => {
    request.ctx = { requestedAt: new Date(), db };
  });

export const setupResponseHandlers = responseHandlersFn<void, GlobalContext>(
  (res, req) => {
    logger.log(
      "[REST] took",
      new Date().getTime() - req.ctx.requestedAt.getTime(),
      "ms",
    );
  },
);
