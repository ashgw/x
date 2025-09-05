import type { UpstreamResp } from "../types";
import type { CacheControlsQueryDto } from "./dtos";

interface FetchOpts {
  contentType: string;
  defaultRevalidate: number; // seconds
  cacheControl: string; // Cache-Control header we set on 200
}

export async function fetchTextFromUpstream<TBody = string>(input: {
  url: string;
  q?: CacheControlsQueryDto;
  opts: FetchOpts;
}): Promise<UpstreamResp<TBody>> {
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

    const text = (await res.text()) as unknown as TBody;

    return {
      status: 200,
      body: text,
      headers: {
        "Content-Type": opts.contentType,
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
