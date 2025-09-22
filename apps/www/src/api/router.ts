import { contract } from "~/api/contract";
import { gpg } from "@ashgw/constants";
import { rateLimiter, authed } from "~/ts-rest/middlewares";
import type { GlobalContext } from "~/ts-rest/context";
import { createRouterWithContext, middleware } from "~/@ashgw/ts-rest";
import {
  purgeTrashPosts,
  purgeViewWindow,
  notify,
  fetchTextFromUpstream,
  healthCheck,
  reminder,
} from "./functions";
import { logger } from "@ashgw/logger";

export const router = createRouterWithContext(contract)<GlobalContext>({
  reminder: middleware()
    .use(authed())
    .use(rateLimiter({ limit: { every: "1s" } }))
    .route(contract.reminder)(
    async ({ body, headers }) => await reminder({ body, headers }),
  ),

  purgeViewWindow: middleware()
    .use(rateLimiter({ limit: { every: "5s" } }))
    .use(authed())
    .route(contract.purgeViewWindow)(
    async (
      { body, headers },
      {
        request: {
          ctx: {
            requestedAt,
            rateLimitWindow,
            user: { email },
          },
        },
      },
    ) => {
      logger.info("HELOOOOOOOWW");
      logger.info("reminder body", {
        body,
        headers,
        email,
        rateLimitWindow,
        requestedAt,
      });
      return await purgeViewWindow();
    },
  ),

  purgeTrashPosts: middleware()
    .use(rateLimiter({ limit: { every: "5s" } }))
    .use(authed())
    .route(contract.purgeTrashPosts)(async () => await purgeTrashPosts()),

  notify: middleware()
    .use(rateLimiter({ limit: { every: "1s" } }))
    .use(authed())
    .route(contract.notify)(async ({ body }) => await notify({ body })),

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
    await fetchTextFromUpstream({
      query,
      fetchUrl: { github: { repo: "debion", scriptPath: "setup" } },
      opts: {
        defaultRevalidate: 3600,
        cacheControl: "s-maxage=3600, stale-while-revalidate=300",
      },
    }),

  whisper: async ({ query }) =>
    await fetchTextFromUpstream({
      query,
      fetchUrl: { github: { repo: "whisper", scriptPath: "setup" } },
      opts: {
        defaultRevalidate: 3600,
        cacheControl: "s-maxage=3600, stale-while-revalidate=300",
      },
    }),

  gpg: async ({ query }) =>
    await fetchTextFromUpstream({
      query,
      fetchUrl: { direct: { url: gpg.publicUrl } },
      opts: {
        defaultRevalidate: 86400,
        cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
      },
    }),
  healthCheck: async () => await healthCheck(),
});
