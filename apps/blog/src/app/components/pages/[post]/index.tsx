import { Footer } from "@ashgw/components";

import type { PostData } from "~/lib";
import { BlogPostData } from "./components/BlogPostData";

export function BlogPostPage({ postData }: { postData: PostData }) {
  return (
    <>
      <main className="pt-5">
        <BlogPostData postData={postData} />
      </main>
      <div className="py-10"></div>
      <Footer className="pb-12" />
    </>
  );
}
