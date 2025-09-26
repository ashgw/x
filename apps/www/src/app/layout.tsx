import "@ashgw/design/css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { site_name } from "@ashgw/constants";
import {
  createMetadata,
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@ashgw/seo";
import { KeyboardThemeToggle, ThemeProvider } from "@ashgw/design/theme";
import { FirstTimeVisitorBanner } from "@ashgw/components";
import { AnalyticsProvider } from "@ashgw/analytics/client";
import { fonts } from "@ashgw/design/fonts";
import { ToastProvider } from "@ashgw/design/ui";

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
        <ThemeProvider>
          <ToastProvider>
            <JsonLd code={organizationJsonLd(siteUrl)} />
            <JsonLd code={websiteJsonLd(siteUrl)} />
            <KeyboardThemeToggle />
            <AnalyticsProvider>
              <TsrProvider>{children}</TsrProvider>
            </AnalyticsProvider>
            <FirstTimeVisitorBanner />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
