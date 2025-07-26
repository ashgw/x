import { memo } from "react";

import type { PostDetailRo } from "~/api/models";
import { Newsletter } from "~/app/components/pages/[post]/components/newsletter";
import { BlogPostData } from "./components/BlogPostData";

export const BlogPostPage = memo(function BlogPostPage({
  postData,
}: {
  postData: PostDetailRo;
}) {
  return (
    <>
      <main className="pt-5">
        <BlogPostData postData={postData} />
      </main>
      <div className="py-10"></div>
      <Newsletter />
    </>
  );
});
