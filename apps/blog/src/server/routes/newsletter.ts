import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import { NewsletterService } from "../services/newsletter";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      await NewsletterService.subscribe({
        email: input.email,
      });
    }),
});
