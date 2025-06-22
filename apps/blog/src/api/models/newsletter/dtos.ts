import { z } from "zod";

export const newsletterSubscribeDtoSchema = z.object({
  email: z.string().email().max(255),
});

export type NewsletterSubscribeDto = z.infer<
  typeof newsletterSubscribeDtoSchema
>;
