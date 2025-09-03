import { pbkdf2Sync, randomBytes } from "crypto";

import { db } from "@ashgw/db";
import { blogs } from "./data/blogs";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

async function createAdminUser() {
  const email = "admin@ashgw.me";
  const password = "Admin123";
  const name = "Admin";

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { email: true },
  });

  if (existingUser) {
    // eslint-disable-next-line no-restricted-syntax
    console.log("[seed] Admin user already exists");
    return;
  }

  const passwordHash = hashPassword(password);
  await db.user.create({
    data: { email, passwordHash, name, role: "ADMIN" },
  });
  // eslint-disable-next-line no-restricted-syntax
  console.log("[seed] Admin user created");
}

async function seedPosts() {
  for (const blog of blogs) {
    await db.post.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        seoTitle: blog.seoTitle,
        summary: blog.summary,
        isReleased: blog.isReleased,
        firstModDate: blog.firstModDate, // keep exact dates from dataset
        lastModDate: blog.lastModDate,
        minutesToRead: blog.minutesToRead,
        tags: blog.tags,
        category: blog.category,
        mdxText: blog.mdxContentRaw, // <- MDX stored in DB now
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        seoTitle: blog.seoTitle,
        summary: blog.summary,
        isReleased: blog.isReleased,
        firstModDate: blog.firstModDate,
        lastModDate: blog.lastModDate,
        minutesToRead: blog.minutesToRead,
        tags: blog.tags,
        category: blog.category,
        mdxText: blog.mdxContentRaw,
      },
    });
    // eslint-disable-next-line no-restricted-syntax
    console.log(`[seed] upserted post: ${blog.slug}`);
  }
}

export const seed = async () => {
  await seedPosts();
};

async function main() {
  await createAdminUser();
  await seed();
}

main().catch((error) => {
  // eslint-disable-next-line no-restricted-syntax
  console.error("Error in seeder:", error);
  process.exit(1);
});
