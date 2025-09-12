import { z } from "zod";

export const cronAuthedMiddlewareHeaderSchemaDto = z.object({
  "x-cron-token": z.string().length(32),
});

export type CronAuthedMiddlewareHeaderDto = z.infer<
  typeof cronAuthedMiddlewareHeaderSchemaDto
>;
