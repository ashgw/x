import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import {
  JsonLd,
  createMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@ashgw/seo";

import { Providers as GlobalProviders } from "@ashgw/components";
import { env } from "@ashgw/env";
import { fonts } from "@ashgw/ui";

import { TRPCProvider } from "~/trpc/provider";
import { GoBackHome } from "./components/pages/root";
import { StoreProvider } from "./stores";
import { SITE_NAME } from "@ashgw/constants";

const siteUrl = env.NEXT_PUBLIC_BLOG_URL;

export const metadata: Metadata = createMetadata({
  metadataBase: new URL(siteUrl),
  title: SITE_NAME,
  description: "Blog",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <JsonLd code={organizationJsonLd(siteUrl)} />
        <JsonLd code={websiteJsonLd(siteUrl)} />
        <GoBackHome />
        <GlobalProviders site="blog">
          <TRPCProvider siteBaseUrl={siteUrl}>
            <StoreProvider>{children}</StoreProvider>
          </TRPCProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}
