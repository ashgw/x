import Footer from "@/app/components/footer/footer";
import PostSection from "@/app/components/post/post-section";

import { MdxService } from "~/lib";

interface RouteParams {
  params: { post: string };
}

export const generateStaticParams = async () => {
  const posts = await new MdxService("/blog/").getPost();
  if (posts) {
    return posts.map((post) => ({ post: post.filename }));
  }
  return [];
};

export default async function Blog({ params }: RouteParams) {
  const post = await getBlogPost(params.post);

  return (
    <>
      <main className="pt-5">
        <PostSection post={post} />
      </main>
      <div className="py-10"></div>
      <Footer />)
    </>
  );
}
