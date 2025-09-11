import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { endPoint } from "~/ts-rest/endpoint";
import { logger, monitor } from "@ashgw/observability";
import { router } from "~/api/router";
import {
  setupRequestMiddleware,
  setupResponseHandlers,
} from "~/ts-rest/middlewares/global-setup";

export const runtime = "nodejs";

const handler = createNextHandler(contract, router, {
  basePath: endPoint,
  handlerType: "app-router",
  responseValidation: true,
  jsonQuery: false,
  requestMiddleware: [setupRequestMiddleware()],
  responseHandlers: [setupResponseHandlers],
  errorHandler: (error, { route }) => {
    logger.error(`>>> REST Error on ${route}`, error);
    monitor.next.captureException({
      error,
      hint: { extra: { route } },
    });
  },
});

export { handler as GET, handler as DELETE };
