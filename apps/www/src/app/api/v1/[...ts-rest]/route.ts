import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { router } from "~/api/router";
import { logger, monitor } from "@ashgw/observability";

export const runtime = "edge";

const handler = createNextHandler(v1Contract, router, {
  basePath: endPoint,
  handlerType: "app-router",
  responseValidation: true,
  errorHandler: (error, { route }) => {
    monitor.next.captureException({
      error,
      hint: {
        extra: {
          route,
        },
      },
    });
    logger.error(`>>> REST Error on ${route}`, error);
  },
});

export { handler as GET };
