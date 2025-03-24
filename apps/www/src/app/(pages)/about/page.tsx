import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { AboutPage } from "~/app/components/pages/about";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const metadata: Metadata = createMetadata({
  title: "About",
  description: "About me.",
});

export default function Page() {
  return <AboutPage />;
}
