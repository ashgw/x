import "server-only"; // DO NOT DELETE THIS DAWG
import { cache } from "react";
import { headers, cookies } from "next/headers";
import { createTRPCClient, loggerLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import type { AppRouter } from "~/api/router";
import { env } from "@ashgw/env";
import type { TRPCRequestInfo } from "@trpc/server/unstable-core-do-not-import";
import type { NextRequest, NextResponse } from "next/server";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { db } from "@ashgw/db";

import { appRouter } from "~/api/router";
import { createCallerFactory } from "~/trpc/root";
import { createTRPCContext } from "~/trpc/context";
import { makeQueryClient } from "~/trpc/callers/query-client";
import { getTrpcUrl } from "./client";

const nakedCtx = createTRPCContext({
  db,
  req: {} as NextRequest,
  res: {} as NextResponse,
  trpcInfo: {} as TRPCRequestInfo,
});

const serverSideCaller = createCallerFactory(appRouter)(nakedCtx);

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const getQueryClient = cache(makeQueryClient);

// THIS CALLER WOULD ONLY BE USED FOR TESTS &  RANDOM PLAYGROUND TESTS, DOESNT NOT REQUIRE THE APP RUNNING
// (THE CONTEXT IS STRIPPED)
//
// REMEMBER: use HydrateClient for server side hydration if not using the default fallbacks provided by Next.js
export const { trpc: trpcRpcServerSideClient, HydrateClient } =
  createHydrationHelpers<AppRouter>(serverSideCaller, getQueryClient);

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...(init ?? {}), cache: "no-store" });

const getTrpcBaseUrl = (): string => {
  if (env.NEXT_PUBLIC_CURRENT_ENV === "development") {
    // on my local machine
    return env.NODE_ENV === "development"
      ? "http://localhost:3001" //  next dev
      : "http://localhost:3000"; // next build
  } else {
    // running on a server somewhere, this is already set
    return env.NEXT_PUBLIC_BLOG_URL;
  }
};

const getHttpClient = cache(() =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink(),
      httpBatchLink({
        url: getTrpcUrl({ siteBaseUrl: getTrpcBaseUrl() }),
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

// This will be used acorss the RSC so we have the context full, this bridge with HTTP through the exposed tRPC defined endpoint
// REMEMBER: use HydrateClient for server side hydration if not using the default fallbacks provided by Next.js
export const trpcHttpServerSideClient = getHttpClient();
