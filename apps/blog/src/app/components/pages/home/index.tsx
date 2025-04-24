import { trpcServerSideClient } from "~/trpc/server";
import { BlogCards } from "./components/BlogCards";

export async function HomePage() {
  const posts = await trpcServerSideClient.post.getPosts();

  return <BlogCards posts={posts} />;
}
