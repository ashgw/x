import { z } from "zod";
import { slug } from "../_shared";

// ========== DTOs ==========

export const trackViewSchemaDto = z.object({
  slug,
});

// ========== ROs ==========
export const trackViewRoSchema = z.object({
  total: z.number(),
});

// ========== Types ==========

export type TrackViewDto = z.infer<typeof trackViewSchemaDto>;
export type TrackViewRo = z.infer<typeof trackViewRoSchema>;
