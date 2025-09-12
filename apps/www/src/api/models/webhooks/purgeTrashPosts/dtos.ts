import { z } from "zod";
import { cronAuthedMiddlewareHeaderSchemaDto } from "../../shared";

export const purgeTrashPostsHeaderSchemaDto =
  cronAuthedMiddlewareHeaderSchemaDto;

export const purgeTrashPostsBodySchemaDto = z.object({
  retentionDays: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional()
    .describe("Override retention window in days, defaults to 30"),
});

export type PurgeTrashPostsHeadersDto = z.infer<
  typeof purgeTrashPostsHeaderSchemaDto
>;

export type PurgeTrashPostsBodyDto = z.infer<
  typeof purgeTrashPostsBodySchemaDto
>;
