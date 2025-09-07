"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getOptimizedQueryClient } from "./query-client";
import { tsrQueryClientSide } from "./client";

export function TsrProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <QueryClientProvider client={getOptimizedQueryClient()}>
      <tsrQueryClientSide.ReactQueryProvider>
        {props.children}
      </tsrQueryClientSide.ReactQueryProvider>
    </QueryClientProvider>
  );
}
