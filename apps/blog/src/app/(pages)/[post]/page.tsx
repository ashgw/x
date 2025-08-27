import type { Metadata } from "next";

import { NotFound } from "@ashgw/components";
import {
  createMetadata,
  JsonLd,
  blogPostingJsonLd,
  breadcrumbsJsonLd,
} from "@ashgw/seo";
import { BlogPostPage } from "~/app/components/pages/[post]";
import { HydrateClient, trpcServerSide } from "~/trpc/server";

interface DynamicRouteParams {
  params: { post: string };
}

export async function generateMetadata({
  params,
}: DynamicRouteParams): Promise<Metadata> {
  const postData = await trpcServerSide.post.getPost({
    slug: params.post,
  });
  if (!postData) {
    return {
      title: "Post not found",
      description: `The post (${params.post}) was not found`,
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }

  const canonical = `${env.NEXT_PUBLIC_WWW_URL}/blog/${postData.slug}`;
  const isDraft = postData.isReleased;

  return createMetadata({
    title: postData.title,
    description: postData.seoTitle,
    keywords: postData.tags,
  });
}

export default async function Page({ params }: DynamicRouteParams) {
  const postData = await trpcServerSide.post.getPost({
    slug: params.post,
  });

  if (!postData) {
    return <NotFound message={`No post found that matches  /${params.post}`} />;
  }

  return (
    <HydrateClient>
      <BlogPostPage postData={postData} />
    </HydrateClient>
  );
}
