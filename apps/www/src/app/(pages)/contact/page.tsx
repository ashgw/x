import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { ContactPage } from "~/app/components/pages/contact";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Let's talk!",
});

export default function Page() {
  return <ContactPage />;
}
