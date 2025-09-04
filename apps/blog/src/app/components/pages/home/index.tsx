import { HydrateClient, trpcServerSide } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";

export async function HomePage() {
  const posts = await trpcServerSide.post.getPublicPostCards();
  return (
    <HydrateClient>
      <PostCardsPage posts={posts} />
    </HydrateClient>
  );
}
