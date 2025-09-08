import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { logger, monitor } from "@ashgw/observability";
import {
  setupGlobalRequestMiddleware,
  setupGlobalResponseMiddleware,
} from "~/api/middlewares";
import { router } from "~/api/router";

export const runtime = "nodejs";

const handler = createNextHandler(contract, router, {
  basePath: endPoint,
  handlerType: "app-router",
  responseValidation: true,
  jsonQuery: false,
  requestMiddleware: [setupGlobalRequestMiddleware()],
  responseHandlers: [
    (res, req) => {
      setupGlobalResponseMiddleware(res, req);
    },
  ],
  errorHandler: (error, { route }) => {
    logger.error(`>>> REST Error on ${route}`, error);
    monitor.next.captureException({
      error,
      hint: { extra: { route } },
    });
  },
});

export { handler as GET, handler as DELETE };
