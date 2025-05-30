import { redirect } from "next/navigation";

import { createMetadata } from "@ashgw/seo";

import { EditorPage } from "~/app/components/pages/editor";

export const metadata = createMetadata({
  title: "Editor",
  description: "Editor",
});

type SearchParams = Record<string, string | string[] | undefined>;

// Make page secure with server-side authentication check
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  // If email/password are in URL, redirect to clean URL
  if (searchParams.email || searchParams.password) {
    redirect("/editor");
  }

  return <EditorPage />;
}
