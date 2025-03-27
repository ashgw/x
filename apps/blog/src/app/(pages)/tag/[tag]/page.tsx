import type { Metadata } from "next";

import { createMetadata } from "@ashgw/seo";

import { TagsPage } from "~/app/components/pages/[tag]";
import { MdxService } from "~/lib";

interface DynamicRouteParams {
  params: { tag: string };
}

export const generateStaticParams = async () => {
  const posts = await new MdxService("public/blogs").getPosts();
  return posts.map((post) => ({ post: post.filename }));
};

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Sort by tag.",
});

export default async function Tags({ params }: DynamicRouteParams) {
  const posts = await new MdxService("public/blogs").getPosts();
  return <TagsPage posts={posts} tag={params.tag} />;
}
