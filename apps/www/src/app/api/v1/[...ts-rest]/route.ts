import { createNextHandler, tsr } from "@ts-rest/serverless/next";
import { contract } from "~/api/contract";
import type { Contract } from "~/api/contract";
import { endPoint } from "~/api/endpoint";
import type { TsrContext } from "~/api/context";
import { logger, monitor } from "@ashgw/observability";
import { db } from "@ashgw/db";
export const runtime = "edge";
import { fetchTextFromUpstream } from "~/api/functions/fetchTextFromUpstream";
import { healthCheck } from "~/api/functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "~/api/functions/webhooks";
import type { Keys } from "ts-roids";

interface UserRo {
  id: string;
  email: string;
  name: string;
  avatar: { url: string };
  role: "admin" | "visitor";
}
export interface TsrContextWithUser {
  ctx: TsrContext["ctx"] & { user: UserRo };
}

function withAuth<R extends Contract[Keys<Contract>]>(route: R) {
  const build = tsr.routeWithMiddleware(route)<TsrContext, TsrContextWithUser>;
  type BuildOpts = Parameters<typeof build>[0];
  return (handler: BuildOpts["handler"]) =>
    build({
      middleware: [(req) => req.ctx.user.name === "Marcus"],
      handler,
    });
}

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
    healthCheck: withAuth(contract.healthCheck)(async () => healthCheck()),
    purgeViewWindow: withAuth(contract.purgeViewWindow)(async ({ headers }) =>
      webhooks.purgeViewWindow({ "x-cron-token": headers["x-cron-token"] }),
    ),
  },
  {
    basePath: endPoint,
    handlerType: "app-router",
    responseValidation: true,
    jsonQuery: false,
    requestMiddleware: [
      tsr.middleware<TsrContext>((request) => {
        request.ctx.time = new Date();
        request.ctx.db = db;
      }),
    ],
    responseHandlers: [
      (_response, request) => {
        logger.log(
          "[REST] took",
          new Date().getTime() - request.ctx.time.getTime(),
          "ms",
        );
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
