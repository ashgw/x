import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { TagsPage } from "~/app/components/pages/[tag]";
import { HydrateClient } from "~/trpc/server";
import { trpcHttpServerSideClient } from "~/trpc/callers/server/http";

interface DynamicRouteParams {
  params: { tag: string };
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Sort by tag.",
});

export default async function Tags({ params }: DynamicRouteParams) {
  const posts = await trpcHttpServerSideClient.post.getPublicPostCards.query();
  return (
    <HydrateClient>
      <TagsPage posts={posts} tag={params.tag} />;
    </HydrateClient>
  );
}
