import { logger } from "@ashgw/observability";
import type { CacheControlsQueryDto, ErrorRo } from "./schemas";
import { contentTypes } from "./schemas";

/** Uniform HTTP result for ts-rest handlers */
interface Ok {
  status: 200;
  body: string;
  headers?: Record<string, string>;
}
interface Fail {
  status: 424 | 500;
  body: ErrorRo;
  headers?: Record<string, string>;
}
export type Resp = Ok | Fail;

interface FetchOpts {
  contentType: string;
  defaultRevalidate: number; // seconds
  cacheControl: string; // Cache-Control header we set on 200
}

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const t0 = Date.now();
  try {
    return await fn();
  } finally {
    const dt = Date.now() - t0;
    logger.debug(`[REST] ${label} took ${dt}ms`);
  }
}

async function fetchTextFromUpstream(input: {
  url: string;
  q?: CacheControlsQueryDto;
  opts: FetchOpts;
}): Promise<Resp> {
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
          message: `Upstream error`,
          details: { status: res.status, url },
        },
      };
    }

    const text = await res.text();

    return {
      status: 200,
      body: text,
      headers: {
        "Content-Type": opts.contentType,
        "Cache-Control": opts.cacheControl,
      },
    };
  } catch (error) {
    logger.error("fetchTextFromUpstream failed", { url, error });
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

export const Controllers = {
  bootstrap: (args: { q?: CacheControlsQueryDto }) =>
    timed("bootstrap", () =>
      fetchTextFromUpstream({
        q: args.q,
        url: "https://raw.githubusercontent.com/AshGw/dotfiles/main/install/bootstrap",
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
        url: "https://raw.githubusercontent.com/ashgw/debion/main/setup",
        opts: {
          contentType: contentTypes.text,
          defaultRevalidate: 3600,
          cacheControl: "s-maxage=3600, stale-while-revalidate=300",
        },
      }),
    ),
};
