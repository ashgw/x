import { z } from "zod";

import { publicProcedure, router } from "../../trpc/trpc";
import { newsletterSubscribeDtoSchema } from "../models";
import { NewsletterService } from "../services";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(newsletterSubscribeDtoSchema)
    .output(z.void())
    .mutation(async ({ input }) => {
      await NewsletterService.subscribe({
        email: input.email,
      });
    }),
});
