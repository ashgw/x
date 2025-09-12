// TODO: to each schema we need to add as many docs as possible so the openAPI defintion
// becomes rich so AI can use it
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

export const cronAuthedMiddlewareHeaderSchemaDto = z.object({
  "x-cron-token": z.string().length(32),
});

export const purgeViewWindowHeadersSchemaDto =
  cronAuthedMiddlewareHeaderSchemaDto.extend({});

// ========== Types ==========

export type FetchTextFromUpstreamQueryDto = z.infer<
  typeof fetchTextFromUpstreamQuerySchemaDto
>;

export type PurgeViewWindowHeadersDto = z.infer<
  typeof purgeViewWindowHeadersSchemaDto
>;

export type CronAuthedMiddlewareHeaderDto = z.infer<
  typeof cronAuthedMiddlewareHeaderSchemaDto
>;
