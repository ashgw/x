import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { CookieBanner, Providers } from "@ashgw/components";
import { createMetadata } from "@ashgw/seo";
import { fonts } from "@ashgw/ui";

import { NavBar } from "./components/nav";

const title = "Ashref Gwader";
const description = "Building the future.";

export const metadata: Metadata = createMetadata({ title, description });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
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
