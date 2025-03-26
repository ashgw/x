import { Posts } from "~/app/components/posts";
import { PostsProvider } from "~/app/components/posts/components/Context";
import { MdxService } from "~/lib/index";

export async function Blogs() {
  const posts = await new MdxService("public/blogs").getPosts();

  return (
    <>
      <section className="container mx-auto sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
        <h1 className="mb-8 hidden text-2xl font-medium tracking-tighter">
          Unclassified, raw
        </h1>
        <PostsProvider>
          <Posts posts={posts} />
        </PostsProvider>
        <div className="h-full w-auto"></div>
      </section>
      <div className="py-6" />
    </>
  );
}
