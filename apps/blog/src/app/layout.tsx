import "@ashgw/design/css/base.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import {
  JsonLd,
  createMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@ashgw/seo";

import { AnalyticsProvider } from "@ashgw/analytics/client";
import { env } from "@ashgw/env";
import { DesignProvider } from "@ashgw/design";
import { PurpleTheme } from "@ashgw/design/themes";
import { fonts } from "@ashgw/design/fonts";

import { TRPCProvider } from "~/trpc/provider";
import { GoBackHome } from "./components/pages/root";
import { StoreProvider } from "./stores";
import { site_name } from "@ashgw/constants";

const siteUrl = env.NEXT_PUBLIC_BLOG_URL;

export const metadata: Metadata = createMetadata({
  metadataBase: new URL(siteUrl),
  title: site_name,
  description: "Blog",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <JsonLd code={organizationJsonLd(siteUrl)} />
        <JsonLd code={websiteJsonLd(siteUrl)} />
        <GoBackHome />
        <DesignProvider theme={PurpleTheme} mode="system">
          <AnalyticsProvider>
            <TRPCProvider siteBaseUrl={siteUrl}>
              <StoreProvider>{children}</StoreProvider>
            </TRPCProvider>
          </AnalyticsProvider>
        </DesignProvider>
      </body>
    </html>
  );
}
