import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { LoginPage } from "~/app/components/pages/login";

export const metadata: Metadata = createMetadata({
  title: "Login",
  description: "Login to your account.",
});

export default function Page() {
  return <LoginPage />;
}
