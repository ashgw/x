import { createNextHandler } from "@ts-rest/serverless/next";
import { v1Contract } from "~/api/contract";
import { Controllers } from "~/api/controllers";
import { logger, monitor } from "@ashgw/observability";

export const runtime = "nodejs";

const handler = createNextHandler(
  v1Contract,
  {
    bootstrap: async ({ query }) => Controllers.bootstrap({ q: query }),
    gpg: async ({ query }) => Controllers.gpg({ q: query }),
    debion: async ({ query }) => Controllers.debion({ q: query }),
  },
  {
    handlerType: "app-router",
    basePath: "/api/v1",
    responseValidation: true,
    errorHandler(error, req) {
      logger.error(`>>> ts-rest Error on '${req.url}'`, error);
      monitor.next.captureException({ error });
    },
    // cors: true, // not needed for now
  },
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
