// TODO: add docs through schema description here
import { z } from "zod";

// ========== Schemas ==========

export const fetchTextFromUpstreamQuerySchemaDto = z
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

export const purgeViewWindowHeadersSchemaDto = z.object({
  "x-cron-token": z.string().length(32),
});

// ========== Types ==========

export type FetchTextFromUpstreamQueryDto = z.infer<
  typeof fetchTextFromUpstreamQuerySchemaDto
>;

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;
