import type { QueryClient } from "@tanstack/react-query";
import type { Optional } from "ts-roids";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "~/api/router";
import { makeQueryClient } from "./query-client";

let clientQueryClientSingleton: Optional<QueryClient> = null;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export const trpcUri = "/api/trpc";

const isBrowser = typeof window !== "undefined";

export function getTrpcUrl({ siteBaseUrl }: { siteBaseUrl: string }) {
  // For client-side requests, use relative path
  // For server-side requests, use full URL
  return isBrowser ? trpcUri : `${siteBaseUrl}${trpcUri}`;
}

export const trpcClientSideClient = createTRPCReact<AppRouter>();
