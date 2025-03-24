import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { HomePage } from "~/app/components/pages/home";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const metadata: Metadata = createMetadata({
  title: "Home",
  description: "Welcome home.",
});

export default function Page() {
  return <HomePage />;
}
