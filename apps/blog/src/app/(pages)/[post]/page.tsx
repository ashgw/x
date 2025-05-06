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

export async function generateMetadata({ params }: DynamicRouteParams) {
  const postData = await trpcServerSideClient.post.getPost({
    slug: params.post,
  });

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

  return <BlogPostPage postData={postData} />;
}
