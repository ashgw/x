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

import { trpc } from "~/utils/trpc";
import { GoBackHome } from "./components/pages/root";

const title = "Ashref Gwader";
const description = "Blog";

export const metadata: Metadata = createMetadata({ title, description });

/**
 * Determines the base URL for API requests based on the current runtime environment.
 *
 * In a browser context, it returns an empty string, while on the server it returns the production URL (constructed with NEXT_PUBLIC_BLOG_URL) in production or a localhost URL during development.
 *
 * @returns The base URL as a string, or an empty string in a browser environment.
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (env.NODE_ENV === "production")
    return `https://${env.NEXT_PUBLIC_BLOG_URL}`;
  return "http://localhost:3000";
}

/**
 * Root layout component for the blog application.
 *
 * Establishes the HTML document structure and wraps its content with TRPC and React Query providers to manage data fetching and state.
 * It initializes a query client and configures a TRPC client with an HTTP batch link that includes custom headers.
 * Additionally, it renders a back navigation component and applies a specific font to the document body.
 *
 * @param children - Elements to be rendered within the layout.
 */
export default function RootLayout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
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
