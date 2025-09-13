import "server-only";
import { cache } from "react";
import { headers, cookies } from "next/headers";

import { createTRPCClient, loggerLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

import superjson from "superjson";
import type { AppRouter } from "~/api/router";
import { env } from "@ashgw/env";
import { getTrpcUrl } from "../client";

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...(init ?? {}), cache: "no-store" });

export const getHttpClient = cache(() =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink(),
      httpBatchLink({
        url: getTrpcUrl({ siteBaseUrl: env.NEXT_PUBLIC_BLOG_URL }),
        transformer: superjson,
        headers() {
          const h = headers();
          const out: Record<string, string> = {};
          h.forEach((v, k) => {
            out[k] = v;
          });

          const cookie = cookies().toString();
          if (cookie) out.cookie = cookie;

          out["x-trpc-source"] = "rsc-http";
          return out;
        },
        fetch: noStoreFetch,
      }),
    ],
  }),
);

// This will be used acorss the RSC so we have the context full
export const httpClient = getHttpClient();
