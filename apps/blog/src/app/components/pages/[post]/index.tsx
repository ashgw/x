import { Footer } from "@ashgw/components";

import { MdxService } from "~/lib";
import { BlogPostData } from "./components/BlogPost";

export const generateStaticParams = async () => {
  const posts = await new MdxService("public/blogs").getPosts();
  return posts.map((post) => ({ post: post.filename }));
};

interface RouteParams {
  params: { post: string };
}

export async function BlogPost({ params }: RouteParams) {
  const postData = await new MdxService("public/blogs").getPost(params.post);

  return (
    <>
      <main className="pt-5">
        <BlogPostData postData={postData} />
      </main>
      <div className="py-10"></div>
      <Footer />
    </>
  );
}
