import { HydrateClient } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";
import { httpClient } from "~/trpc/callers/server/http";

export async function HomePage() {
  const posts = await httpClient.post.getPublicPostCards.query();
  return (
    <HydrateClient>
      <PostCardsPage posts={posts} />
    </HydrateClient>
  );
}
