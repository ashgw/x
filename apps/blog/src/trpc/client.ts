import type { QueryClient } from "@tanstack/react-query";
import type { Optional } from "ts-roids";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "~/server/router";
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

export function getTrpcUrl(input: { siteBaseUrl: string }) {
  return typeof window !== "undefined" ? "" : `${input.siteBaseUrl}${trpcUri}`;
}

export const trpcClientSideClient = createTRPCReact<AppRouter>();
