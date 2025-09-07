import { logger } from "@ashgw/observability";
import type { PurgeViewWindowWebhookDto } from "~/api/schemas/dtos";
import type { PurgeViewWindowWebhookResponses } from "~/api/schemas/responses";

// TODO: import this later when the bitch ass fuckin wifi driver is fixed
// TODO: also remove the blog service view implementation
// TODO: also test ts
// TODO: also add a child logger for crons, to see what's up
// TODO: put logger in a seperate package
// TODO: fix fucking package install errors

import { db } from "../../../../../../packages/db/src/index";
import { env } from "@ashgw/env";

const RETAIN_DAYS = 2; // keep 2 days for safety
const CUTOFF = new Date(Date.now() - 1000 * 60 * 60 * 24 * RETAIN_DAYS);

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
  logger.info("Cleaning up the post view window");
  try {
    const deleted = await db.postViewWindow.deleteMany({
      where: { bucketStart: { lt: CUTOFF } }, // uses @@index([bucketStart])
    });
    if (deleted.count) {
      logger.info("View window records purged successfully", {
        deleted: deleted.count,
        cutoff: CUTOFF.toISOString(),
      });
    }
    return {
      status: 200,
      body: undefined,
    };
  } catch (error) {
    logger.error("purgeViewWindow cleanup failed", { error });
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Oops! Looks like it's on me this time",
      },
    };
  }
}
