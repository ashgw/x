import { contentTypes } from "./schemas";
import { timed } from "./functions/timed";
import { fetchTextFromUpstream } from "./functions/fetchTextFromUpstream";
import { v1Contract } from "./contract";
import { makeControllers } from "./controller-types";

function repoMainBranchBaseUrl({
  repo,
  scriptPath,
}: {
  repo: string;
  scriptPath: string;
}) {
  return `https://raw.githubusercontent.com/ashgw/${repo}/main/${scriptPath}`;
}

export const Controllers = makeControllers(v1Contract)({
  myPost: ({ body }) => {
    return {
      status: 200,
      body: body.content,
    };
  },
  bootstrap: async (args) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream<string>({
        q: args.query,
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
  gpg: async (args) =>
    timed("gpg", () =>
      fetchTextFromUpstream<string>({
        q: args.query,
        url: "https://github.com/ashgw.gpg",
        opts: {
          contentType: contentTypes.pgp,
          defaultRevalidate: 86400,
          cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
        },
      }),
    ),

  debion: async (args) =>
    timed("debion", () =>
      fetchTextFromUpstream<string>({
        q: args.query,
        url: repoMainBranchBaseUrl({ repo: "debion", scriptPath: "setup" }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),

  whisper: async (args) =>
    timed("whisper", () =>
      fetchTextFromUpstream<string>({
        q: args.query,
        url: repoMainBranchBaseUrl({ repo: "whisper", scriptPath: "setup" }),
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
});
