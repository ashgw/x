import { z } from "zod";

// ========== DTOs ==========

export const trackViewSchemaDto = z.object({
  postSlug: z.string().min(1),
});

// ========== ROs ==========
//
// ========== Types ==========

export type TrackViewDto = z.infer<typeof trackViewSchemaDto>;
