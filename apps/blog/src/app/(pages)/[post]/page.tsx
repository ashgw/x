import { BlogPost } from "~/app/components/pages/[post]";
import { MdxService } from "~/lib";

// export const generateStaticParams = async () => {
//   const posts = await new MdxService("public/blogs").getPosts();
//   return posts.map((post) => ({ post: post.filename }));
// };

interface PageProps {
  params: Promise<{ postName: string }>;
}

export default async function Page({ params }: PageProps) {
  const { postName } = await params;
  const postData = await new MdxService("public/blogs").getPost(postName);
  return <BlogPost postData={postData} />;
}
