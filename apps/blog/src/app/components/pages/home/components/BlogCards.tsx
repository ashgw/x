import type { PostDataRo } from "~/server/models";
import { Posts } from "~/app/components/posts";
import { PostsProvider } from "~/app/components/posts/components/Context";

export function BlogCards({ posts }: { posts: PostDataRo[] }) {
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
