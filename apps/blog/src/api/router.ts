import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

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

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
