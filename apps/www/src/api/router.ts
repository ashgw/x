import { contract } from "~/api/contract";
import { fetchTextFromUpstream } from "~/api/functions/fetchTextFromUpstream";
import { healthCheck } from "~/api/functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "~/api/functions/webhooks";
import { rateLimiter } from "~/ts-rest/middlewares/rateLimiter";
import type { GlobalContext } from "../ts-rest/context";
import { createRouterWithContext, middlware } from "~/@ashgw/ts-rest";
import { authed } from "~/ts-rest/middlewares/authed";

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
  // TODO: need to also add docs to tell the user to remember t oadd the schema defintion of any thing
  // especially any error when it comes to middlewares, for exmaple, we need tpo add 403 forbidden erro
  // to the defintoon sicne the rl middlware might retirn a formbdden sttaus
  purgeViewWindow: middlware()
    .use(rateLimiter({ limit: { every: "3s" } }))
    .use(authed())
    .route({ route: contract.purgeViewWindow })(async ({ headers }) => {
    return webhooks.purgeViewWindow({
      "x-cron-token": headers["x-cron-token"],
    });
  }),
  healthCheck: async () => healthCheck(),
});
