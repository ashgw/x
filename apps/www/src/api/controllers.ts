import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";
import { v1Contract } from "./contract";
import { repoMainBranchBaseUrl, timed } from "./utils";
import { checkHealth } from "./functions/checkHealth";
import { makeController } from "./extended";
import { gpg } from "@ashgw/constants";

export const controller = makeController(v1Contract)({
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
  healthCheck: async () => timed("healthCheck", () => checkHealth()),
});
