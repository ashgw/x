import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { AboutPage } from "~/app/components/pages/about";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "About me.",
});

export default function Page() {
  return <AboutPage />;
}
