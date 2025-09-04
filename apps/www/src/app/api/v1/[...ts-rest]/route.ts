import { logger, monitor } from "@ashgw/observability";
import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { basePath } from "~/api/basePath";
import { router } from "~/api/router";

export const runtime = "nodejs";

const handler = createNextHandler(v1Contract, router, {
  basePath,
  handlerType: "app-router",
  responseValidation: true,
  errorHandler(error, req) {
    logger.error(`>>> REST Error on '${req.url}'`, error);
    monitor.next.captureException({ error });
  },
});

export { handler as GET, handler as OPTIONS };
