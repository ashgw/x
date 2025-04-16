import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { getQueryClient, getTrpcUrl } from "./client";
import { trpc } from "./index";
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
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.client.createClient({
      links: [
        httpBatchLink({
          url: getTrpcUrl({ siteBaseUrl: props.siteBaseUrl }),
          transformer,
        }),
      ],
    }),
  );
  return (
    <trpc.client.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.client.Provider>
  );
}
