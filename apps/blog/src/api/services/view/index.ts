import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { InternalError, logger } from "@ashgw/observability";
import { Prisma } from "@ashgw/db/raw";

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

  public async trackView({ slug }: { slug: string }): Promise<void> {
    const headersList = this.req.headers;
    const ipAddress =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      "127.0.0.1";
    const userAgent = headersList.get("user-agent") ?? "unknown";

    const fingerprint = this._fingerprint({ slug, ipAddress, userAgent });
    const bucketStart = this._utcMidnight(new Date()); // 24h bucket

    try {
      await this.db.$transaction(async (tx) => {
        try {
          await tx.postViewWindow.create({
            data: { postSlug: slug, fingerprint, bucketStart },
          });

          // only reached if create did NOT violate unique constraint
          await tx.post.update({
            where: { slug },
            data: { viewsCount: { increment: 1 } },
          });
        } catch (e: unknown) {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            return; // already counted this fp today
          }
          throw e;
        }
      });

      await this._maybeCleanup();
    } catch (error) {
      logger.error("Failed to track view", { error, slug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to track view",
        cause: error,
      });
    }
  }

  private async _maybeCleanup(): Promise<void> {
    const now = Date.now();
    if (Math.random() >= ViewService.CLEANUP_PROB) return;
    if (now - ViewService.lastCleanupAt < ViewService.MIN_CLEANUP_INTERVAL_MS)
      return;

    // best-effort – if two instances race, who cares
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
