import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { getQueryClient, getTrpcUrl, trpcClient } from "./client";
import { transformer } from "./transformer";

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
    siteBaseUrl: string;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there ais no boundary
  const queryClientInstance = getQueryClient();
  const [trpcClientInstance] = useState(() =>
    trpcClient.createClient({
      links: [
        httpBatchLink({
          url: getTrpcUrl({ siteBaseUrl: props.siteBaseUrl }),
          transformer,
        }),
      ],
    }),
  );

  return (
    <trpcClient.Provider
      client={trpcClientInstance}
      queryClient={queryClientInstance}
    >
      <QueryClientProvider client={queryClientInstance}>
        {props.children}
      </QueryClientProvider>
    </trpcClient.Provider>
  );
}
