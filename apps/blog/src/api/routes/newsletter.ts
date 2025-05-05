import { publicProcedure, router } from "../../trpc/trpc";
import { newsletterSubscribeDtoSchema } from "../models/newsletter";
import { newsletterSubscribeRo } from "../models/newsletter/ros";
import { NewsletterService } from "../services";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(newsletterSubscribeDtoSchema)
    .output(newsletterSubscribeRo)
    .mutation(async ({ input }) => {
      return await NewsletterService.subscribe({
        email: input.email,
      });
    }),
});
