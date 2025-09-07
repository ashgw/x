import { tsr } from "@ts-rest/serverless/fetch";
import { contract } from "~/api/contract";
import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";
import { timed } from "./timed";
import { healthCheck } from "./functions/healthCheck";
import { gpg } from "@ashgw/constants";
import { webhooks } from "./functions/webhooks";

export const router = tsr.router(contract, {
  bootstrap: async ({ query }) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream({
        query,
        fetchUrl: {
          github: {
            repo: "dotfiles",
            scriptPath: "install/bootstrap",
          },
        },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),

  debion: async ({ query }) =>
    timed("debion", () =>
      fetchTextFromUpstream({
        query,
        fetchUrl: {
          github: {
            repo: "debion",
            scriptPath: "setup",
          },
        },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  whisper: async ({ query }) =>
    timed("whisper", () =>
      fetchTextFromUpstream({
        query,
        fetchUrl: {
          github: {
            repo: "whisper",
            scriptPath: "setup",
          },
        },
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  gpg: async ({ query }) =>
    timed("gpg", () =>
      fetchTextFromUpstream({
        query,
        fetchUrl: {
          direct: {
            url: gpg.publicUrl,
          },
        },
        opts: {
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    ),
  healthCheck: async () => timed("healthCheck", () => healthCheck()),
  purgeViewWindow: async ({ headers }) =>
    timed("purgeViewWindow", () =>
      webhooks.purgeViewWindow({ "x-cron-token": headers["x-cron-token"] }),
    ),
});
