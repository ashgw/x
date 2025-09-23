import { logger } from "@ashgw/logger";
import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { apiV1endpoint } from "~/ts-rest/endpoint";
import { monitor } from "@ashgw/monitor";
import { router } from "~/api/router";
import {
  setupRequestMiddleware,
  setupResponseHandlers,
} from "~/ts-rest/middlewares";

export const runtime = "nodejs";

// Next.js App Router handler for ts-rest v3 contract
// - requestMiddleware/responseHandlers wired via local ts-rest-kit wrappers
// - responseValidation enabled to align with strictStatusCodes
const handler = createNextHandler(contract, router, {
  basePath: apiV1endpoint,
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

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
