import type { QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "~/server/root";
import { makeQueryClient } from "./query-client";

export const client = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient | null = null;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export function getTrpcUrl(input: { siteBaseUrl: string }) {
  return typeof window !== "undefined" ? "" : `${input.siteBaseUrl}/api/trpc`;
}
