import { Footer } from "@ashgw/components";

import { MdxService } from "~/lib";
import { BlogPostData } from "./components/BlogPostData";

export async function BlogPost({ postName }: { postName: string }) {
  const postData = await new MdxService("public/blogs").getPost(postName);

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
