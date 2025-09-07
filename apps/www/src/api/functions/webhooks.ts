import { logger } from "@ashgw/observability";
import type { PurgeViewWindowWebhookDto } from "../schemas/dtos";
import type { PurgeViewWindowWebhookResponses } from "../schemas/responses";

async function purgeViewWindow(
  input: PurgeViewWindowWebhookDto,
): Promise<PurgeViewWindowWebhookResponses> {
  await new Promise((r) => setTimeout(r, 1));
  logger.log(input);
  return {
    status: 200,
    body: undefined,
  };
}

export const webhooks = {
  purgeViewWindow,
} as const;
