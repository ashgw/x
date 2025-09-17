"use client";

import { QueryClientProvider } from "@ts-rest/react-query/tanstack";
import { getOptimizedQueryClient } from "./query-client";
import { tsrQueryClientSideClient } from "~/ts-rest/client";

export function TsrProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  return (
    <QueryClientProvider client={getOptimizedQueryClient()}>
      <tsrQueryClientSideClient.ReactQueryProvider>
        {props.children}
      </tsrQueryClientSideClient.ReactQueryProvider>
    </QueryClientProvider>
  );
}
