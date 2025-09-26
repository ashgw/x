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
import { DesignSystemProvider } from "@ashgw/design/provider";

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
    <DesignSystemProvider>
      <JsonLd code={organizationJsonLd(siteUrl)} />
      <JsonLd code={websiteJsonLd(siteUrl)} />
      <AnalyticsProvider>
        <TsrProvider>{children}</TsrProvider>
      </AnalyticsProvider>
    </DesignSystemProvider>
  );
}
