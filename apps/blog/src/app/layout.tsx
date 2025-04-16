import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { headers } from "next/headers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { Providers } from "@ashgw/components";
import { env } from "@ashgw/env";
import { createMetadata } from "@ashgw/seo";
import { fonts } from "@ashgw/ui";

import { trpc } from "~/trpc";
import { GoBackHome } from "./components/pages/root";

export const metadata: Metadata = createMetadata({
  title: "Ashref Gwader",
  description: "Blog",
});

export default function RootLayout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${env.NEXT_PUBLIC_BLOG_URL}/api/trpc`,
        headers() {
          const heads = new Map(headers());
          heads.set("x-trpc-source", "react");
          return Object.fromEntries(heads);
        },
      }),
    ],
  });

  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <GoBackHome />
        <Providers site="blog">
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </trpc.Provider>
        </Providers>
      </body>
    </html>
  );
}
