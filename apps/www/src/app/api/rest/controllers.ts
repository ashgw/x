import { logger } from "@ashgw/observability";

interface Ok {
  status: 200;
  body: string;
  headers?: Record<string, string>;
}

interface UpstreamFail {
  status: 424;
  body: string;
}

interface ServerFail {
  status: 500;
  body: string;
}

type Resp = Ok | UpstreamFail | ServerFail;

// tiny helper to DRY the fetch+text+headers pattern
async function fetchText(
  url: string,
  opts: {
    cacheControl?: string;
    contentType?: string;
    revalidateSeconds?: number;
  } = {},
): Promise<Resp> {
  try {
    const res = await fetch(url, {
      next: opts.revalidateSeconds
        ? { revalidate: opts.revalidateSeconds }
        : undefined,
      cache: opts.revalidateSeconds ? "force-cache" : "no-store",
    });

    if (!res.ok) {
      return { status: 424 as const, body: `Upstream error (${res.status})` };
    }

    const text = await res.text();
    const headers: Record<string, string> = {};

    if (opts.contentType)
      headers["Content-Type"] = `${opts.contentType}; charset=utf-8`;
    if (opts.cacheControl) headers["Cache-Control"] = opts.cacheControl;

    return { status: 200 as const, body: text, headers };
  } catch (error) {
    logger.error("fetchText failed", { url, error });
    return { status: 500 as const, body: "Internal Server Error" };
  }
}

export async function getBootstrap(): Promise<Resp> {
  return fetchText(
    "https://raw.githubusercontent.com/AshGw/dotfiles/main/install/bootstrap",
    {
      contentType: "text/plain",
      cacheControl: "s-maxage=3600, stale-while-revalidate=300",
      revalidateSeconds: 3600,
    },
  );
}

export async function getGpg(): Promise<Resp> {
  return fetchText("https://github.com/ashgw.gpg", {
    contentType: "application/pgp-keys",
    cacheControl: "s-maxage=86400, stale-while-revalidate=86400",
    revalidateSeconds: 86400,
  });
}

export async function getDebion(): Promise<Resp> {
  return fetchText(
    "https://raw.githubusercontent.com/ashgw/debion/main/setup",
    {
      contentType: "text/plain",
      cacheControl: "s-maxage=3600, stale-while-revalidate=300",
      revalidateSeconds: 3600,
    },
  );
}
