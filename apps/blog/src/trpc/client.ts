import type { QueryClient } from "@tanstack/react-query";
import type { Optional } from "ts-roids";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "~/api/router";
import { trpcUri } from "./endpoint";
import { makeQueryClient } from "./query-client";

let clientQueryClientSingleton: Optional<QueryClient> = null;

const isServer = typeof window === "undefined";

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

const isBrowser = !isServer;

export function getTrpcUrl({ siteBaseUrl }: { siteBaseUrl: string }) {
  // For client-side requests, use relative path
  // For server-side requests, use full URL
  return isBrowser ? trpcUri : `${siteBaseUrl}${trpcUri}`;
}

export const trpcClientSideClient = createTRPCReact<AppRouter>();
