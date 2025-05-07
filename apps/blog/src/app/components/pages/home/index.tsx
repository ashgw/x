import { trpcServerSideClient } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";

export async function HomePage() {
  const posts = await trpcServerSideClient.post.getPostCards();
  return <PostCardsPage posts={posts} />;
}
