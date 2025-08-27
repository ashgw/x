import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

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

const title = "Ashref Gwader";
const description = "Building the future.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  metadataBase: new URL(env.NEXT_PUBLIC_WWW_URL),
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <JsonLd code={organizationJsonLd(env.NEXT_PUBLIC_WWW_URL)} />
      <JsonLd code={websiteJsonLd(env.NEXT_PUBLIC_WWW_URL)} />
      <body className={fonts.atkinsonHyperlegible.className}>
        <NavBar />
        <Providers site="www">{children}</Providers>
        <div className="fixed bottom-4 right-4 max-w-[550px]">
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
