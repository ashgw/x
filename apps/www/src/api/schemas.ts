import { z } from "zod";

export const errorSchemaRo = z.object({
  code: z
    .enum([
      "UPSTREAM_ERROR",
      "INTERNAL_ERROR",
      "BAD_REQUEST",
      "NOT_FOUND",
      "UNAUTHORIZED",
      "FORBIDDEN",
    ])
    .describe("Stable, machine-parseable error code"),
  message: z.string().min(1).max(1000).describe("Human readable"),
  details: z.record(z.any()).optional().describe("Optional extra context"),
});
export type ErrorRo = z.infer<typeof errorSchemaRo>;

export const cacheControlsQueryDtoSchema = z
  .object({
    revalidateSeconds: z
      .string()
      .regex(/^\d+$/)
      .transform((v) => Number(v))
      .pipe(z.number().int().min(60).max(86400))
      .optional()
      .describe("Override ISR revalidate in seconds, 60..86400"),
  })
  .strict();

export type CacheControlsQueryDto = z.infer<typeof cacheControlsQueryDtoSchema>;

export const contentTypes = {
  text: "text/plain",
  pgp: "application/pgp-keys",
} as const;
