import type { CacheControlsQueryDto } from "./schemas";
import { contentTypes } from "./schemas";
import { timed } from "./functions/timed";
import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";

function repoMainBranchBaseUrl({
  repo,
  scriptPath,
}: {
  repo: string;
  scriptPath: string;
}) {
  return `https://raw.githubusercontent.com/ashgw/${repo}/main/${scriptPath}`;
}

export const Controllers = {
  bootstrap: (args: { q?: CacheControlsQueryDto }) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream({
        q: args.q,
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

  gpg: (args: { q?: CacheControlsQueryDto }) =>
    timed("gpg", () =>
      fetchTextFromUpstream({
        q: args.q,
        url: "https://github.com/ashgw.gpg",
        opts: {
          contentType: contentTypes.pgp,
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    ),

  debion: (args: { q?: CacheControlsQueryDto }) =>
    timed("debion", () =>
      fetchTextFromUpstream({
        q: args.q,
        url: repoMainBranchBaseUrl({
          repo: "debion",
          scriptPath: "setup",
        }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,

          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
  whisper: (args: { q?: CacheControlsQueryDto }) =>
    timed("whisper", () =>
      fetchTextFromUpstream({
        q: args.q,
        url: repoMainBranchBaseUrl({
          repo: "whisper",
          scriptPath: "setup",
        }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
};
