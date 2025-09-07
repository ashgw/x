"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getOptimizedQueryClient } from "./query-client";
import { tsrQueryClient } from "./client";

export function TsrProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <QueryClientProvider client={getOptimizedQueryClient()}>
      <tsrQueryClient.ReactQueryProvider>
        {props.children}
      </tsrQueryClient.ReactQueryProvider>
    </QueryClientProvider>
  );
}
