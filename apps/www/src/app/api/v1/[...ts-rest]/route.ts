import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { basePath } from "~/api/basePath";
import { router } from "~/api/router";
import { logger, monitor } from "@ashgw/observability";

export const runtime = "edge";

const handler = createNextHandler(v1Contract, router, {
  basePath,
  handlerType: "app-router",
  responseValidation: true,
  errorHandler: (error, req) => {
    monitor.next.captureException({
      error,
      hint: {
        extra: {
          route: req.route,
        },
      },
    });
    logger.error(`>>> REST Error`, error);
  },
});

export { handler as GET };
