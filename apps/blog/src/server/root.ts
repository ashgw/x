import { postsRouter } from "./routers/posts";
import { router } from "./trpc";

export const appRouter = router({
  posts: postsRouter,
  // Add other blog-related routers here
});

export type AppRouter = typeof appRouter;
