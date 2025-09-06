import { z } from "zod";
import type { InferRequest } from "../types";

// ========== Schemas ==========

export const cacheControlsQueryRequestSchema = z
  .object({
    revalidateSeconds: z
      .string()
      .regex(/^\d+$/)
      .transform((v) => Number(v))
      .pipe(z.number().int().min(60).max(86400))
      .optional()
      .describe("Override ISR revalidate in seconds, 60..86400"),
  })
  .passthrough();

// ========== Types ==========

export type CacheControlsQueryRequest = InferRequest<
  typeof cacheControlsQueryRequestSchema
>;
