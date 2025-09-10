import { logger, monitor } from "@ashgw/observability";
import type { PurgeViewWindowHeadersDto } from "~/api/schemas/dtos";
import type { PurgeViewWindowResponses } from "~/api/schemas/responses";

// TODO: also remove the blog service view implementation
// TODO: also add a child logger for crons, to see what's up
// TODO: put logger in a seperate package

import { db } from "@ashgw/db";
import { env } from "@ashgw/env";

const RETAIN_DAYS = 2; // keep 2 days for safety
const CUTOFF = new Date(Date.now() - 1000 * 60 * 60 * 24 * RETAIN_DAYS);

export async function purgeViewWindow(
  input: PurgeViewWindowHeadersDto,
): Promise<PurgeViewWindowResponses> {
  if (input["x-cron-token"] !== env.X_CRON_TOKEN) {
    return {
      status: 401,
      body: {
        code: "UNAUTHORIZED",
        message: "Cron token is invalid, you cannot perform this action",
      },
    };
  }

  try {
    const deleted = await db.postViewWindow.deleteMany({
      where: { bucketStart: { lt: CUTOFF } }, // uses @@index([bucketStart])
    });
    if (deleted.count) {
      logger.info("View window records purged successfully!", {
        deleted: deleted.count,
        cutoff: CUTOFF.toISOString(),
      });
    }

    logger.info("No record to purge, view window is clean");

    return {
      status: 200,
      body: undefined,
    };
  } catch (error) {
    logger.error("purgeViewWindow cleanup failed", { error });
    monitor.next.captureException({ error });
    return {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Oops! Looks like it's on me this time",
      },
    };
  }
}
