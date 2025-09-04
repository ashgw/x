import { createHash } from "crypto";
import type { NextRequest } from "next/server";

import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { InternalError, logger } from "@ashgw/observability";

export class ViewService {
  private readonly db: DatabaseClient;
  private readonly req: NextRequest;
  private static readonly DEDUPLICATION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

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

    try {
      // Generate fingerprint that uniquely identifies this view
      const fingerprint = this._generateFingerprint({
        slug,
        ipAddress,
        userAgent,
      });

      // Check if view already exists within the deduplication window
      const existingView = await this.db.postView.findFirst({
        where: {
          fingerprint,
          postSlug: slug,
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
          postSlug: slug,
          fingerprint,
        },
      });

      logger.info("View tracked", { slug });
    } catch (error) {
      logger.error("Failed to track view", { error, slug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to track view",
        cause: error,
      });
    }
  }

  private _generateFingerprint({
    slug,
    ipAddress,
    userAgent,
  }: {
    slug: string;
    ipAddress: string;
    userAgent: string;
  }): string {
    // Hash the IP address with salt first for extra security
    const hashedIp = createHash("sha256")
      .update(ipAddress + env.IP_HASH_SALT)
      .digest("hex");

    // This fingerprint uniquely identifies a view while preserving privacy
    const data = `${slug}:${hashedIp}:${userAgent}`;
    return createHash("sha256").update(data).digest("hex");
  }
}
