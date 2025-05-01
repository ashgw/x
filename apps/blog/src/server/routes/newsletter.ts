import { publicProcedure, router } from "../../trpc/trpc";
import { newsletterSubscribeDtoSchema } from "../models/newsletter";
import { NewsletterService } from "../services";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(newsletterSubscribeDtoSchema)
    .query(async ({ input }) => {
      await NewsletterService.subscribe({
        email: input.email,
      });
    }),
});
