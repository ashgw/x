import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import { env } from "@ashgw/env";
import { createMetadata } from "@ashgw/seo";
import { atkinsonHyperlegible } from "@ashgw/ui";

import { GoBackHome } from "./components/pages/root";
import { Providers } from "./components/providers";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const title = "Ashref Gwader";
const description = "Blog.";

export const metadata: Metadata = createMetadata({ title, description });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={atkinsonHyperlegible.className}>
        <GoBackHome />
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
