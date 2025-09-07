import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { logger } from "@ashgw/observability";
import type { TrackViewRo } from "~/api/models/view";

export class ViewService {
  private readonly db: DatabaseClient;
  private readonly req: NextRequest;

  private static readonly RETAIN_DAYS = 2; // keep 2 days for safety
  private static readonly CLEANUP_PROB = 0.01; // 1% of requests try cleanup
  private static readonly MIN_CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 min
  private static lastCleanupAt = 0;

  constructor({ db, req }: { db: DatabaseClient; req: NextRequest }) {
    this.db = db;
    this.req = req;
  }

  public async trackView({ slug }: { slug: string }): Promise<TrackViewRo> {
    const headersList = this.req.headers;
    const ipAddress =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      "127.0.0.1";
    const userAgent = headersList.get("user-agent") ?? "unknown";

    const fingerprint = this._fingerprint({ slug, ipAddress, userAgent });
    const bucketStart = this._utcMidnight(new Date());

    let total = 0;
    await this.db.$transaction(async (tx) => {
      const inserted = await tx.postViewWindow.createMany({
        data: { postSlug: slug, fingerprint, bucketStart },
        skipDuplicates: true,
      });

      if (inserted.count > 0) {
        const updated = await tx.post.update({
          where: { slug },
          data: { viewsCount: { increment: 1 } },
          select: { viewsCount: true },
        });
        total = updated.viewsCount;
        logger.info("New view tracked", { slug });
      } else {
        const existing = await tx.post.findUnique({
          where: { slug },
          select: { viewsCount: true },
        });
        logger.info("User already saw the post, no view to track", {
          slug,
        });
        total = existing?.viewsCount ?? 0;
      }
    });
    await this._maybeCleanup();
    return { total };
  }

  private async _maybeCleanup(): Promise<void> {
    const now = Date.now();
    if (Math.random() >= ViewService.CLEANUP_PROB) return;
    logger.info("Cleaning up the post view window");
    if (now - ViewService.lastCleanupAt < ViewService.MIN_CLEANUP_INTERVAL_MS)
      return;

    // best-effort – if two instances race, who cares gang
    ViewService.lastCleanupAt = now;

    const cutoff = new Date(
      Date.now() - ViewService.RETAIN_DAYS * 24 * 60 * 60 * 1000,
    );

    try {
      const deleted = await this.db.postViewWindow.deleteMany({
        where: { bucketStart: { lt: cutoff } }, // uses @@index([bucketStart])
      });
      if (deleted.count) {
        logger.info("PostViewWindow cleanup", {
          deleted: deleted.count,
          cutoff: cutoff.toISOString(),
        });
      }
    } catch (e) {
      // never break the request path for cleanup failures
      logger.warn("PostViewWindow cleanup failed (ignored)", { error: e });
    }
  }

  private _fingerprint({
    slug,
    ipAddress,
    userAgent,
  }: {
    slug: string;
    ipAddress: string;
    userAgent: string;
  }): string {
    const hashedIp = createHash("sha256")
      .update(ipAddress + env.IP_HASH_SALT)
      .digest("hex");
    return createHash("sha256")
      .update(`${slug}:${hashedIp}:${userAgent}`)
      .digest("hex");
  }

  private _utcMidnight(d: Date): Date {
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
  }
}
