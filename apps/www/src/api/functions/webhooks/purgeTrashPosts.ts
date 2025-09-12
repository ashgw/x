import { logger, monitor } from "@ashgw/observability";
import type { PurgeTrashPostsResponses } from "~/api/models";
import { db } from "@ashgw/db";

const RETENTION_DAYS = 30;

export async function purgeTrashPosts(): Promise<PurgeTrashPostsResponses> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  try {
    const { count } = await db.trashPost.deleteMany({
      where: { deletedAt: { lt: cutoff } },
    });

    logger.info("Trashed posts purged", {
      deleted: count,
      cutoff: cutoff.toISOString(),
    });
    return { status: 204, body: undefined };
  } catch (error) {
    logger.error("purgeTrashPosts cleanup failed", { error });
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
