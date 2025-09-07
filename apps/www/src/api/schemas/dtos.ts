import { z } from "zod";

// ========== Schemas ==========

export const cacheControlsQueryRequestSchemaDto = z
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

export const purgeViewWindowCronSchemaDto = z.object({
  token: z.string().min(1).max(64),
});

// ========== Types ==========

export type CacheControlsQueryDto = z.infer<
  typeof cacheControlsQueryRequestSchemaDto
>;

export type PurgeViewWindowCronDto = z.infer<
  typeof purgeViewWindowCronSchemaDto
>;
