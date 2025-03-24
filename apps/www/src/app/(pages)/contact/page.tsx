import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { ContactPage } from "~/app/components/pages/contact";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Let's talk!",
});

export default function Page() {
  return <ContactPage />;
}
