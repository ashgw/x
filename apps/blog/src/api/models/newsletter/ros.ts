import { z } from "zod";

export const newsletterSubscribeRo = z.void();

export type NewsletterSubscribeRo = z.infer<typeof newsletterSubscribeRo>;
