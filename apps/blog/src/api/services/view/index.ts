import { createHash } from "crypto";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
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
  }: ViewTrackingData): Promise<void> {
    try {
      // Generate fingerprint that uniquely identifies this view
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
        return;
      }

      // Create the view record
      await this.db.postView.create({
        data: {
          postSlug,
          fingerprint,
        },
      });

      logger.info("View tracked", { postSlug });
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
    // Hash the IP address with salt first for extra security
    const hashedIp = createHash("sha256")
      .update(ipAddress + env.IP_HASH_SALT)
      .digest("hex");

    // This fingerprint uniquely identifies a view while preserving privacy
    const data = `${postSlug}:${hashedIp}:${userAgent}`;
    return createHash("sha256").update(data).digest("hex");
  }
}
