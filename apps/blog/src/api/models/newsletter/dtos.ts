import { z } from "zod";

export const newsletterSubscribeDtoSchema = z.object({
  email: z.string().email().max(255, {
    message: "Email is too long",
  }),
});

export type NewsletterSubscribeDto = z.infer<
  typeof newsletterSubscribeDtoSchema
>;
