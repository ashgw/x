import { z } from "zod";
import { email } from "../_shared";

export const newsletterSubscribeDtoSchema = z.object({
  email,
});

export type NewsletterSubscribeDto = z.infer<
  typeof newsletterSubscribeDtoSchema
>;
