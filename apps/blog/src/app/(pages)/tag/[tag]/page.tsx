import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { TagsPage } from "~/app/components/pages/[tag]";
import { trpc } from "~/utils/trpc";

interface DynamicRouteParams {
  params: { tag: string };
}

export const generateStaticParams = () => {
  const posts = trpc.client.post.getPosts.useQuery({
    blogPath: "public/blogs",
  });
  const tags = Array.from(
    new Set(posts.data?.flatMap((post) => post.parsedContent.attributes.tags)),
  );
  return tags.map((tag) => ({ tag }));
};

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Sort by tag.",
});

export default function Tags({ params }: DynamicRouteParams) {
  const posts = trpc.client.post.getPosts.useQuery({
    blogPath: "public/blogs",
  });
  if (posts.isLoading) {
    return <div>Loading...</div>;
  }
  if (posts.isError) {
    return <div>Error</div>;
  }
  if (posts.data) {
    return <TagsPage posts={posts.data} tag={params.tag} />;
  }
  return <div>No posts found</div>;
}
