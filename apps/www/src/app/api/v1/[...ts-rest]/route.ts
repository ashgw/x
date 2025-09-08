import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import { logger, monitor } from "@ashgw/observability";
import { fetchTextFromUpstream } from "~/api/functions/fetchTextFromUpstream";
import { healthCheck } from "~/api/functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "~/api/functions/webhooks";
import { rateLimiterMiddleware } from "~/api/middlewares";
import {
  setupGlobalRequestMiddleware,
  setupGlobalResponseMiddleware,
} from "~/api/middlewares";

export const runtime = "nodejs";

const handler = createNextHandler(
  contract,
  {
    bootstrap: async ({ query }) =>
      fetchTextFromUpstream({
        query,
        fetchUrl: {
          github: { repo: "dotfiles", scriptPath: "install/bootstrap" },
        },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),

    debion: async ({ query }) =>
      fetchTextFromUpstream({
        query,
        fetchUrl: { github: { repo: "debion", scriptPath: "setup" } },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),

    whisper: async ({ query }) =>
      fetchTextFromUpstream({
        query,
        fetchUrl: { github: { repo: "whisper", scriptPath: "setup" } },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),

    gpg: async ({ query }) =>
      fetchTextFromUpstream({
        query,
        fetchUrl: { direct: { url: gpg.publicUrl } },
        opts: {
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    purgeViewWindow: rateLimiterMiddleware({
      route: contract.purgeViewWindow,
      limit: {
        every: "5s",
      },
    })(async ({ headers }) =>
      webhooks.purgeViewWindow({ "x-cron-token": headers["x-cron-token"] }),
    ),
    healthCheck: async () => healthCheck(),
  },
  {
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
  },
);

export { handler as GET, handler as DELETE };
