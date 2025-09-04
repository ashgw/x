import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { TagsPage } from "~/app/components/pages/[tag]";
import { HydrateClient, trpcServerSide } from "~/trpc/server";

interface DynamicRouteParams {
  params: { tag: string };
}

export const generateStaticParams = async () => {
  const posts = await trpcServerSide.post.getPublicPostCards();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  return tags.map((tag) => ({ tag }));
};

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Sort by tag.",
});

export default async function Tags({ params }: DynamicRouteParams) {
  const posts = await trpcServerSide.post.getPublicPostCards();
  return (
    <HydrateClient>
      <TagsPage posts={posts} tag={params.tag} />;
    </HydrateClient>
  );
}
