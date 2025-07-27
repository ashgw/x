import { router } from "../trpc/trpc";
import { newsletterRouter } from "./routes/newsletter";
import { postRouter } from "./routes/post";
import { viewRouter } from "./routes/view";

export const appRouter = router({
  post: postRouter,
  newsletter: newsletterRouter,
  view: viewRouter,
});

export type AppRouter = typeof appRouter;
