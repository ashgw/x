import { router } from "../trpc/root";
import { newsletterRouter } from "./routes/newsletter";
import { postRouter } from "./routes/post";
import { userRouter } from "./routes/user";

export const appRouter = router({
  post: postRouter,
  newsletter: newsletterRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
