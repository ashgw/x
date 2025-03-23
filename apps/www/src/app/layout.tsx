import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import { env } from "@ashgw/env";
import { createMetadata } from "@ashgw/seo";
import { atkinsonHyperlegible } from "@ashgw/ui";

import { NavBar } from "./components/nav";
import { Providers } from "./components/providers";

const title = "Ashref Gwader";
const description = "Builing the future.";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const metadata: Metadata = createMetadata({ title, description });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={atkinsonHyperlegible.className}>
        <NavBar />
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
