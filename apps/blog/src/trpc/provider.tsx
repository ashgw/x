"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { HEADER_NAMES } from "~/api/services/auth/consts";
import { getQueryClient, getTrpcUrl, trpcClientSide } from "./client";
import { transformer } from "./transformer";

function getCsrfTokenCookie(): string {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf_token="))
    ?.split("=")[1];
  return csrfToken ?? "";
}

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
    trpcClientSide.createClient({
      links: [
        httpBatchLink({
          url: getTrpcUrl({ siteBaseUrl: props.siteBaseUrl }),
          transformer,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              // CORS & cookies included
              credentials: "include",
              headers: {
                ...options?.headers,
                [HEADER_NAMES.CSRF_TOKEN]: getCsrfTokenCookie(),
              },
            });
          },
        }),
      ],
    }),
  );

  return (
    <trpcClientSide.Provider
      client={trpcClientInstance}
      queryClient={queryClientInstance}
    >
      <QueryClientProvider client={queryClientInstance}>
        {props.children}
      </QueryClientProvider>
    </trpcClientSide.Provider>
  );
}
