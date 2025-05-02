import { router } from "../trpc/trpc";
import { newsletterRouter } from "./routes/newsletter";
import { postRouter } from "./routes/post";

export const appRouter = router({
  post: postRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
