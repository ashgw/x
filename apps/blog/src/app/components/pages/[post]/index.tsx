import type { PostDetailRo } from "~/server/models";
import { Newsletter } from "~/app/components/pages/[post]/components/newsletter";
import { BlogPostData } from "./components/BlogPostData";

export function BlogPostPage({ postData }: { postData: PostDetailRo }) {
  return (
    <>
      <main className="pt-5">
        <BlogPostData postData={postData} />
      </main>
      <div className="py-10"></div>
      <Newsletter />
    </>
  );
}
