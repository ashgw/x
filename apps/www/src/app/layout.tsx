import "@ashgw/design/css/base.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { site_name } from "@ashgw/constants";
import {
  createMetadata,
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@ashgw/seo";

import { AnalyticsProvider } from "@ashgw/analytics/client";

import { DesignProvider } from "@ashgw/design/provider";
import { PurpleTheme } from "@ashgw/design/themes";
import { fonts } from "@ashgw/ui";

import { env } from "@ashgw/env";
import { TsrProvider } from "~/ts-rest/provider";

const description = "Building the future.";

const siteUrl = env.NEXT_PUBLIC_WWW_URL;

export const metadata: Metadata = createMetadata({
  title: site_name,
  description,
  metadataBase: new URL(siteUrl),
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <JsonLd code={organizationJsonLd(siteUrl)} />
        <JsonLd code={websiteJsonLd(siteUrl)} />
        <DesignProvider theme={PurpleTheme} mode="system">
          <AnalyticsProvider>
            <TsrProvider>{children}</TsrProvider>
          </AnalyticsProvider>
        </DesignProvider>
      </body>
    </html>
  );
}
