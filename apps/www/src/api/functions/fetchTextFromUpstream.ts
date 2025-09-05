import type { CacheControlsQueryDto } from "../models/dtos";
import type {
  FetchGpgFromUpstreamResponses,
  FetchTextFromUpstreamResponses,
} from "../models/ros";

interface FetchOpts {
  defaultRevalidate: number; // seconds
  cacheControl: string;
}

type FetchUpstreamResponses =
  | FetchTextFromUpstreamResponses
  | FetchGpgFromUpstreamResponses;

export async function fetchTextFromUpstream(input: {
  url: string;
  q?: CacheControlsQueryDto;
  opts: FetchOpts;
}): Promise<FetchUpstreamResponses> {
  const { url, opts } = input;
  const revalidateSeconds =
    input.q?.revalidateSeconds ?? opts.defaultRevalidate;

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
          details: { status: res.status, url },
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
    // eslint-disable-next-line no-restricted-syntax
    console.error("fetchTextFromUpstream failed", { url, error });
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Internal error",
        details: { url },
      },
    };
  }
}
