import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";
import { repoMainBranchBaseUrl, timed } from "./utils";
import { checkHealth } from "./functions/checkHealth";
import { gpg } from "@ashgw/constants";
import { webhooks } from "./functions/webhooks";

export const router = tsr.router(v1Contract, {
  bootstrap: async ({ query }) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream({
        q: query,
        url: repoMainBranchBaseUrl({
          repo: "dotfiles",
          scriptPath: "install/bootstrap",
        }),
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),

  gpg: async ({ query }) =>
    timed("gpg", () =>
      fetchTextFromUpstream({
        q: query,
        url: gpg.publicUrl,
        opts: {
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    ),

  debion: async ({ query }) =>
    timed("debion", () =>
      fetchTextFromUpstream({
        q: query,
        url: repoMainBranchBaseUrl({
          repo: "debion",
          scriptPath: "setup",
        }),
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  healthCheck: async () => timed("healthCheck", () => checkHealth()),
  whisper: async ({ query }) =>
    timed("whisper", () =>
      fetchTextFromUpstream({
        q: query,
        url: repoMainBranchBaseUrl({
          repo: "whisper",
          scriptPath: "setup",
        }),
        opts: {
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  purgeViewWindow: async ({ headers }) =>
    timed("purgeViewWindow", () =>
      webhooks.purgeViewWindow({ "x-cron-token": headers["x-cron-token"] }),
    ),
});
