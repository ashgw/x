import { z } from "zod";

export const newsletterSubscribeDtoSchema = z.object({
  email: z.string().email(),
});

export type NewsletterSubscribeDto = z.infer<
  typeof newsletterSubscribeDtoSchema
>;
