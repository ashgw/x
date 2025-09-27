import { db } from "@ashgw/db";
import * as argon2 from "argon2";
import crypto from "crypto";
import { logger } from "@ashgw/logger";

const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 14; // 14 days

export async function seedUser() {
  const now = new Date();

  // =========================
  // Create Admin User
  // =========================
  const adminEmail = "admin@example.com";
  const adminPlainPassword = "Admin123"; // change locally

  const adminUser = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin User",
      email: adminEmail,
      emailVerified: true,
      role: "ADMIN",
    },
  });

  const adminHash = await argon2.hash(adminPlainPassword);

  await db.account.upsert({
    where: {
      // Prisma needs a unique. You can also @@unique([accountId, providerId])
      id: `${adminUser.id}-password`,
    },
    update: { password: adminHash, updatedAt: now },
    create: {
      id: `${adminUser.id}-password`,
      accountId: adminEmail,
      providerId: "password", // keep consistent with better-auth
      userId: adminUser.id,
      password: adminHash,
      createdAt: now,
      updatedAt: now,
    },
  });

  const adminSessionToken = crypto.randomBytes(48).toString("hex");
  const adminSessionExpires = new Date(
    Date.now() + SESSION_EXPIRY_SECONDS * 1000,
  );

  await db.session.create({
    data: {
      token: adminSessionToken,
      expiresAt: adminSessionExpires,
      userId: adminUser.id,
      createdAt: now,
      updatedAt: now,
      ipAddress: "127.0.0.1",
      userAgent: "seed-script",
    },
  });

  // =========================
  // Create Visitor User
  // =========================
  const visitorEmail = "visitor@example.com";

  const visitorUser = await db.user.upsert({
    where: { email: visitorEmail },
    update: {},
    create: {
      name: "Visitor User",
      email: visitorEmail,
      emailVerified: false,
      role: "VISITOR",
    },
  });

  logger.info("Seed complete!");
  logger.info("Admin:", {
    email: adminUser.email,
    password: adminPlainPassword,
  });
  logger.info("Visitor:", { email: visitorUser.email });
  logger.info("Admin session token (for testing): " + adminSessionToken);
  logger.info("Session expires at: " + adminSessionExpires.toISOString());
}
