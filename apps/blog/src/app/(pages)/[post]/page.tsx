import { createMetadata } from "@ashgw/seo";

import { BlogPost } from "~/app/components/pages/[post]";
import { MdxService } from "~/lib";

export const generateStaticParams = async () => {
  const posts = await new MdxService("public/blogs").getPosts();
  return posts.map((post) => ({ post: post.filename }));
};

interface DynamicRouteParams {
  params: { post: string };
}

export async function generateMetadata({ params }: DynamicRouteParams) {
  const postData = await new MdxService("public/blogs").getPost(params.post);

  return createMetadata({
    title: postData.filename,
    description: postData.parsedContent.attributes.seoTitle,
    keywords: postData.parsedContent.attributes.tags,
  });
}

export default async function Page({ params }: DynamicRouteParams) {
  const postData = await new MdxService("public/blogs").getPost(params.post);
  return <BlogPost postData={postData} />;
}
