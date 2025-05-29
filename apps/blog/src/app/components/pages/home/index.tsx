import { trpcServerSide } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";

export async function HomePage() {
  const posts = await trpcServerSide.post.getPostCards();
  return <PostCardsPage posts={posts} />;
}
