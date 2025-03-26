import { createMetadata } from "@ashgw/seo";

import { BlogPost } from "~/app/components/pages/[post]";
import { MdxService } from "~/lib";

export const generateStaticParams = async () => {
  const posts = await new MdxService("public/blogs").getPosts();
  return posts.map((post) => ({ post: post.filename }));
};

interface PageProps {
  params: Promise<{ postName: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { postName } = await params;
  return createMetadata({
    title: postName,
    description: postName,
  });
}

export default async function Page({ params }: PageProps) {
  const { postName } = await params;
  return <BlogPost postName={postName} />;
}
