import { logger } from "@ashgw/logger";
import { monitor } from "@ashgw/monitor";
import type { FetchTextFromUpstreamQueryDto } from "~/api/models";
import type {
  FetchGpgFromUpstreamResponses,
  FetchTextFromUpstreamResponses,
} from "~/api/models";
import type { ExclusiveUnion } from "ts-roids";

function repoMainBranchBaseUrl(opts: { repo: string; scriptPath: string }) {
  const { repo, scriptPath } = opts;
  return `https://raw.githubusercontent.com/ashgw/${repo}/main/${scriptPath}`;
}

interface FetchOpts {
  defaultRevalidate: number; // seconds
  cacheControl: string;
}

type FetchUrl = ExclusiveUnion<
  | {
      github: {
        repo: string;
        scriptPath: string;
      };
    }
  | {
      direct: {
        url: string;
      };
    }
>;

type FetchUpstreamResponses =
  | FetchTextFromUpstreamResponses
  | FetchGpgFromUpstreamResponses;

export async function fetchTextFromUpstream(input: {
  fetchUrl: FetchUrl;
  query?: FetchTextFromUpstreamQueryDto;
  opts: FetchOpts;
}): Promise<FetchUpstreamResponses> {
  const { fetchUrl, opts } = input;
  const revalidateSeconds =
    input.query?.revalidateSeconds ?? opts.defaultRevalidate;

  const url = fetchUrl.github
    ? repoMainBranchBaseUrl({
        repo: fetchUrl.github.repo,
        scriptPath: fetchUrl.github.scriptPath,
      })
    : fetchUrl.direct.url;

  try {
    const res = await fetch(url, {
      next: { revalidate: revalidateSeconds },
      cache: "force-cache",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return {
        status: 424,
        body: {
          code: "UPSTREAM_ERROR",
          message: "Upstream error",
        },
      };
    }

    const text = (await res.text()) as unknown as string;

    return {
      status: 200,
      body: text,
      headers: {
        "Cache-Control": opts.cacheControl,
      },
    };
  } catch (error) {
    logger.error("fetchTextFromUpstream failed", { url, error });
    monitor.next.captureException({ error });
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Internal error",
      },
    };
  }
}
