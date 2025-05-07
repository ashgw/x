import type { Metadata } from "next";

import { NotFound } from "@ashgw/components";
import { createMetadata } from "@ashgw/seo";

import { BlogPostPage } from "~/app/components/pages/[post]";
import { trpcServerSideClient } from "~/trpc/server";

export const generateStaticParams = async () => {
  const posts = await trpcServerSideClient.post.getPostCards();
  return posts.map((post) => ({ post: post.slug }));
};

interface DynamicRouteParams {
  params: { post: string };
}

export async function generateMetadata({
  params,
}: DynamicRouteParams): Promise<Metadata> {
  const postData = await trpcServerSideClient.post.getPost({
    slug: params.post,
  });

  if (!postData) {
    return {
      title: "Post not found",
      description: `The post with the given slug (${params.post}) was not found`,
    };
  }

  return createMetadata({
    title: postData.title,
    description: postData.seoTitle,
    keywords: postData.tags,
  });
}

export default async function Page({ params }: DynamicRouteParams) {
  const postData = await trpcServerSideClient.post.getPost({
    slug: params.post,
  });

  if (!postData) {
    return <NotFound message={`No post found that matches  /${params.post}`} />;
  }

  return <BlogPostPage postData={postData} />;
}
