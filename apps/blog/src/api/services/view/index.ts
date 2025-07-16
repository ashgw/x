import { createHash } from "crypto";

import type { DatabaseClient } from "@ashgw/db";
import { InternalError, logger } from "@ashgw/observability";

interface ViewTrackingData {
  postSlug: string;
  ipAddress: string;
  userAgent: string;
}

export class ViewService {
  private readonly db: DatabaseClient;
  private static readonly DEDUPLICATION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

  constructor({ db }: { db: DatabaseClient }) {
    this.db = db;
  }

  public async trackView({
    postSlug,
    ipAddress,
    userAgent,
  }: ViewTrackingData): Promise<{ isNewView: boolean }> {
    try {
      // Generate fingerprint for deduplication
      const fingerprint = this._generateFingerprint({
        postSlug,
        ipAddress,
        userAgent,
      });

      // Check if view already exists within 24 hours
      const existingView = await this.db.postView.findFirst({
        where: {
          fingerprint,
          postSlug,
          createdAt: {
            gte: new Date(Date.now() - ViewService.DEDUPLICATION_WINDOW_MS),
          },
        },
      });

      if (existingView) {
        logger.info("View already tracked within 24h", {
          postSlug,
          fingerprint,
        });
        return { isNewView: false };
      }

      await this.db.postView.create({
        data: {
          postSlug,
          fingerprint,
          ipAddress: this._hashIP(ipAddress),
          userAgent: userAgent.substring(0, 500), // Truncate to fit DB constraint
        },
      });

      logger.info("View tracked successfully", { postSlug, fingerprint });
      return { isNewView: true };
    } catch (error) {
      logger.error("Failed to track view", { error, postSlug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to track view",
        cause: error,
      });
    }
  }

  private _generateFingerprint({
    postSlug,
    ipAddress,
    userAgent,
  }: ViewTrackingData): string {
    const data = `${postSlug}:${ipAddress}:${userAgent}`;
    return createHash("sha256").update(data).digest("hex");
  }

  private _hashIP(ipAddress: string): string {
    return createHash("sha256")
      .update(ipAddress)
      .digest("hex")
      .substring(0, 45);
  }
}
