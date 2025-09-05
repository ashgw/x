import { contentTypes } from "./content-types";
import { timed } from "./functions/timed";
import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";
import { v1Contract } from "./contract";
import { makeControllers } from "./controller-types";
import { repoMainBranchBaseUrl } from "./utils";
import { checkHealth } from "./functions/checkHealth";

export const Controllers = makeControllers(v1Contract)({
  bootstrap: async ({ query }) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream<string>({
        q: query,
        url: repoMainBranchBaseUrl({
          repo: "dotfiles",
          scriptPath: "install/bootstrap",
        }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),

  gpg: async ({ query }) =>
    timed("gpg", () =>
      fetchTextFromUpstream<string>({
        q: query,
        url: "https://github.com/ashgw.gpg",
        opts: {
          contentType: contentTypes.pgp,
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    ),

  debion: async ({ query }) =>
    timed("debion", () =>
      fetchTextFromUpstream<string>({
        q: query,
        url: repoMainBranchBaseUrl({ repo: "debion", scriptPath: "setup" }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),

  whisper: async ({ query }) =>
    timed("whisper", () =>
      fetchTextFromUpstream<string>({
        q: query,
        url: repoMainBranchBaseUrl({ repo: "whisper", scriptPath: "setup" }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  healthCheck: async () => {
    return await checkHealth();
  },
});
