import "server-only";
import { cache } from "react";
import { headers, cookies } from "next/headers";

import { createTRPCClient } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";

import superjson from "superjson";
import type { AppRouter } from "~/api/router";
import { trpcUri } from "~/trpc/endpoint";
import { makeQueryClient } from "./query-client";
import { env } from "@ashgw/env";

export const getQueryClient = cache(makeQueryClient);

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...(init ?? {}), cache: "no-store" });

export const getHttpClient = cache(() =>
  createTRPCClient<AppRouter>({
    links: [
      // loggerLink(), // optional
      httpBatchLink({
        url: env.NEXT_PUBLIC_BLOG_URL + trpcUri,
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

export const httpClient = getHttpClient();
