import { logger, monitor } from "@ashgw/observability";
import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { router } from "~/api/router";

const handler = createNextHandler(v1Contract, router, {
  handlerType: "app-router",
  basePath: "/api/v1",
  responseValidation: true,
  errorHandler(error, req) {
    logger.error(`>>> ts-rest Error on '${req.url}'`, error);
    monitor.next.captureException({ error });
  },
});

export { handler as GET, handler as OPTIONS };
