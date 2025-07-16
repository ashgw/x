import { z } from "zod";

// ========== DTOs ==========

export const trackViewSchemaDto = z.object({
  postSlug: z.string().min(1),
});

// ========== ROs ==========

export const trackViewResponseSchemaRo = z.object({
  success: z.boolean(),
  alreadyViewed: z.boolean(),
});

// ========== Types ==========

export type TrackViewDto = z.infer<typeof trackViewSchemaDto>;
export type TrackViewResponseRo = z.infer<typeof trackViewResponseSchemaRo>;
