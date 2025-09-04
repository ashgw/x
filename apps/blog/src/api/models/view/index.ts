import { z } from "zod";
import { slug } from "../_shared";

// ========== DTOs ==========

export const trackViewSchemaDto = z.object({
  slug,
});

// ========== ROs ==========
//
// ========== Types ==========

export type TrackViewDto = z.infer<typeof trackViewSchemaDto>;
