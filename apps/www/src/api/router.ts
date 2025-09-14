import { contract } from "~/api/contract";
import { fetchTextFromUpstream } from "~/api/functions/fetchTextFromUpstream";
import { healthCheck } from "~/api/functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "~/api/functions/webhooks";
import { rateLimiter, cronAuthed } from "~/ts-rest/middlewares";
import type { GlobalContext } from "~/ts-rest/context";
import { createRouterWithContext, middleware } from "~/@ashgw/ts-rest";

export const router = createRouterWithContext(contract)<GlobalContext>({
  purgeViewWindow: middleware()
    .use(rateLimiter({ limit: { every: "15s" } }))
    .use(cronAuthed())
    .route(contract.purgeViewWindow)(async () => {
    return await webhooks.purgeViewWindow();
  }),

  purgeTrashPosts: middleware()
    .use(rateLimiter({ limit: { every: "5s" } }))
    .use(cronAuthed())
    .route(contract.purgeTrashPosts)(async () => {
    return await webhooks.purgeTrashPosts();
  }),

  notify: middleware().use(cronAuthed()).route(contract.notify)(
    async ({ body }) => {
      return await webhooks.notify({ body });
    },
  ),

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
  healthCheck: async () => healthCheck(),
});
