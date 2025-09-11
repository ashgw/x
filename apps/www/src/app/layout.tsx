import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { site_name } from "@ashgw/constants";
import { CookieBanner, Providers } from "@ashgw/components";
import {
  createMetadata,
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@ashgw/seo";
import { fonts } from "@ashgw/ui";

import { NavBar } from "~/app/components/misc/nav";
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
        <NavBar />
        <Providers site="www">
          <TsrProvider>{children}</TsrProvider>
        </Providers>
        <div className="fixed bottom-4 right-4 max-w-[550px]">
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
