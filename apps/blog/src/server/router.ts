import { router } from "../trpc/trpc";
import { postRouter } from "./routes/post";

export const appRouter = router({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
