import { logger } from "@ashgw/observability";

import { trpcServerSideClient } from "~/trpc/server";
import { PostCardsPage } from "./components/PostCardsPage";

export async function HomePage() {
  const posts = await trpcServerSideClient.post.getPostCards();
  logger.info("XXXXXXXXXX posts", { posts });
  return <PostCardsPage posts={posts} />;
}
