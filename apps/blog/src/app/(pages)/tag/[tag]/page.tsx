import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { TagsPage } from "~/app/components/pages/[tag]";
import { trpc } from "~/utils/trpc";

interface DynamicRouteParams {
  params: { tag: string };
}

export const generateStaticParams = async () => {
  const posts = trpc.post.getPosts.useQuery({ blogPath: "public/blogs" });
  if posts.isLO
  const tags = Array.from(
    new Set(posts.data?.flatMap((post) => post.parsedContent.attributes.tags)),
  );
  return tags.map((tag) => ({ tag }));
};

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Sort by tag.",
});

export default async function Tags({ params }: DynamicRouteParams) {
  const posts = await new MdxService("public/blogs").getPosts();
  return <TagsPage posts={posts} tag={params.tag} />;
}
a;
