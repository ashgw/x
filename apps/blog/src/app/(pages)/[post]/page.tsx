import { createMetadata } from "@ashgw/seo";

import { BlogPostPage } from "~/app/components/pages/[post]";
import { trpcServerSideClient } from "~/trpc/server";

export const generateStaticParams = async () => {
  const posts = await trpcServerSideClient.post.getPosts({
    blogPath: "public/blogs",
  });
  return posts.map((post) => ({ post: post.filename }));
};

interface DynamicRouteParams {
  params: { post: string };
}

export async function generateMetadata({ params }: DynamicRouteParams) {
  const postData = await trpcServerSideClient.post.getPost({
    blogPath: "public/blogs",
    filename: params.post,
  });

  return createMetadata({
    title: postData.filename,
    description: postData.parsedContent.attributes.seoTitle,
    keywords: postData.parsedContent.attributes.tags,
  });
}

export default async function Page({ params }: DynamicRouteParams) {
  const postData = await trpcServerSideClient.post.getPost({
    blogPath: "public/blogs",
    filename: params.post,
  });
  return <BlogPostPage postData={postData} />;
}
