import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Providers } from "@ashgw/components";
import { createMetadata } from "@ashgw/seo";
import { fonts } from "@ashgw/ui";

import { GoBackHome } from "./components/pages/root";

const title = "Ashref Gwader";
const description = "Blog";

export const metadata: Metadata = createMetadata({ title, description });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <GoBackHome />
        <Providers site="blog">{children}</Providers>
      </body>
    </html>
  );
}
