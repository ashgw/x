import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import type { DatabaseClient } from "@ashgw/db";
import { env } from "@ashgw/env";
import { InternalError, logger } from "@ashgw/observability";
import { Prisma } from "@ashgw/db/raw";
export class ViewService {
  private readonly db: DatabaseClient;
  private readonly req: NextRequest;

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
            data: {
              postSlug: slug,
              fingerprint,
              bucketStart,
            },
          });

          // only reached if create did NOT violate unique constraint
          await tx.post.update({
            where: { slug },
            data: { viewsCount: { increment: 1 } },
          });
        } catch (e: unknown) {
          // unique violation means we've already counted this fp today – ignore.
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            return;
          }
          throw e; // real error -> bubble up
        }
      });
    } catch (error) {
      logger.error("Failed to track view", { error, slug });
      throw new InternalError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to track view",
        cause: error,
      });
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
