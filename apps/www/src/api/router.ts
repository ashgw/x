import { contract } from "~/api/contract";
import { fetchTextFromUpstream } from "~/api/functions/fetchTextFromUpstream";
import { healthCheck } from "~/api/functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "~/api/functions/webhooks";
import { rateLimiterMiddleware } from "~/api/middlewares";
import type { GlobalContext } from "./context";
import { createRouterWithContext } from "~/@ashgw/ts-rest/middleware";

export const router = createRouterWithContext(contract)<GlobalContext>({
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
});
