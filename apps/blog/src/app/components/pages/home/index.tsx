import { PostCardsPage } from "./components/PostCardsPage";
import { HydrateClient, trpcHttpServerSideClient } from "~/trpc/callers/server";

export async function HomePage() {
  const posts = await trpcHttpServerSideClient.post.getPublicPostCards.query();
  return (
    <HydrateClient>
      <PostCardsPage posts={posts} />
    </HydrateClient>
  );
}
