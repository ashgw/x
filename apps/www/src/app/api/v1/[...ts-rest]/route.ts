import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { router } from "~/api/router";
import { logger, monitor } from "@ashgw/observability";
export const runtime = "edge";

const handler = createNextHandler(contract, router, {
  basePath: endPoint,
  handlerType: "app-router",
  responseValidation: true,
  errorHandler: (error, { route }) => {
    logger.error(`>>> REST Error on ${route}`, error);
    monitor.next.captureException({
      error,
      hint: {
        extra: {
          route,
        },
      },
    });
  },
});

export { handler as GET, handler as DELETE };
