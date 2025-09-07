import { logger } from "@ashgw/observability";
import type { PurgeViewWindowWebhookDto } from "../../schemas/dtos";
import type { PurgeViewWindowWebhookResponses } from "../../schemas/responses";

// TODO: import this later when the bitch ass fuckin wifi driver is fixed
import { db } from "../../../../../../packages/db/src/index";
import { env } from "@ashgw/env";

export async function purgeViewWindow(
  input: PurgeViewWindowWebhookDto,
): Promise<PurgeViewWindowWebhookResponses> {
  if (input["x-cron-token"] !== env.CRON_TOKEN) {
    return {
      status: 401,
      body: {
        code: "UNAUTHORIZED",
        message: "You're not authorized to perform this action",
      },
    };
  }
  const _a = await db.post.findFirst({
    select: {
      seoTitle: true,
    },
  });

  logger.log(input);
  return {
    status: 200,
    body: undefined,
  };
}
