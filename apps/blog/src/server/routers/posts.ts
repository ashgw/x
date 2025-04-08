import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getAll: publicProcedure.query(async () => {
    // Implement your blog posts fetching logic
    return [
      {
        id: 1,
        title: "First Blog Post",
        content: "Content...",
        date: new Date(),
      },
      {
        id: 2,
        title: "Second Blog Post",
        content: "Content...",
        date: new Date(),
      },
    ];
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      // Implement single post fetching logic
      return {
        id: input.id,
        title: `Blog Post ${input.id}`,
        content: "Content...",
        date: new Date(),
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // Implement post creation logic
      return { id: Math.random(), ...input, date: new Date() };
    }),
});
