import { logger, monitor } from "@ashgw/observability";
import { createNextHandler, tsr } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { Controllers } from "~/api/controllers";

const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) => Controllers.bootstrap({ q: query }),
  gpg: async ({ query }) => Controllers.gpg({ q: query }),
  debion: async ({ query }) => Controllers.debion({ q: query }),
});

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
