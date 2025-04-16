import { trpcServerSideClient } from "~/trpc/server";
import { BlogCards } from "./components/BlogCards";

export async function HomePage() {
  const posts = await trpcServerSideClient.post.getPosts({
    blogPath: "public/blogs",
  });

  return <BlogCards posts={posts} />;
}
