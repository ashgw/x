import { createMetadata } from "@ashgw/seo";

import { BlogPost } from "~/app/components/pages/[post]";
import { MdxService } from "~/lib";

export const generateStaticParams = async () => {
  const posts = await new MdxService("public/blogs").getPosts();

  return posts.map((post) => {
    return createMetadata({
      title: post.parsedContent.attributes.title,
      description: post.parsedContent.attributes.seoTitle,
    });
  });
};

interface PageRouteParams {
  params: { post: string };
}

export default function Page({ params }: PageRouteParams) {
  return <BlogPost postName={params.post} />;
}
