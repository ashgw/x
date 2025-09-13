import { HydrateClient } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";
import { trpcHttpServerSideClient } from "~/trpc/callers/server/http";

export async function HomePage() {
  const posts = await trpcHttpServerSideClient.post.getPublicPostCards.query();
  return (
    <HydrateClient>
      <PostCardsPage posts={posts} />
    </HydrateClient>
  );
}
