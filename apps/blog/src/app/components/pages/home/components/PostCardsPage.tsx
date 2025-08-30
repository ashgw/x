import type { PostCardRo } from "~/api/models";
import { PostCards } from "~/app/components/pages/home/components/postCards";
import { PostsProvider } from "~/app/components/pages/home/components/postCards/components/Context";

export function PostCardsPage({ posts }: { posts: PostCardRo[] }) {
  return (
    <>
      <section className="container mx-auto sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
        <h1 className="mb-8 hidden text-2xl font-medium tracking-tighter">
          Unclassified, raw
        </h1>
        <PostsProvider>
          <PostCards posts={posts} />
        </PostsProvider>
        <div className="h-full w-auto"></div>
      </section>
      <div className="py-6" />
    </>
  );
}
