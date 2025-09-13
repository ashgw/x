import { z } from "zod";

export const cronAuthedMiddlewareHeaderSchemaDto = z
  .object({
    "x-cron-token": z
      .string()
      .length(32)
      .describe("Secret cron authorization token."),
  })
  .describe("Header required for any cron-authenticated request");

export type CronAuthedMiddlewareHeaderDto = z.infer<
  typeof cronAuthedMiddlewareHeaderSchemaDto
>;
