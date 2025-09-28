import { createMetadata } from "@ashgw/seo";

import { SignUpPage } from "~/app/components/pages/sign-up";

export const metadata = createMetadata({
  title: "Sign Up",
  description: "Create your account to get started",
});

export default function Page() {
  return <SignUpPage />;
}
