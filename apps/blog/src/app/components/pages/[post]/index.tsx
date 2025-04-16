import { Footer } from "@ashgw/components";

import type { PostDataRo } from "~/server/models";
import { BlogPostData } from "./components/BlogPostData";

export function BlogPostPage({ postData }: { postData: PostDataRo }) {
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
