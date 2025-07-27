import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Providers as GlobalProviders } from "@ashgw/components";
import { env } from "@ashgw/env";
import { createMetadata } from "@ashgw/seo";
import { fonts } from "@ashgw/ui";

import { TRPCProvider } from "~/trpc/provider";
import { GoBackHome } from "./components/pages/root";
import { StoreProvider } from "./stores";

export const metadata: Metadata = createMetadata({
  title: "Ashref Gwader",
  description: "Blog",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <GoBackHome />
        <GlobalProviders site="blog">
          <TRPCProvider siteBaseUrl={env.NEXT_PUBLIC_BLOG_URL}>
            <StoreProvider>{children}</StoreProvider>
          </TRPCProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}
