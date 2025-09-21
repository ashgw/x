import argon2 from "argon2";

import { db } from "@ashgw/db";
import { blogs } from "./data/mdx";

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 64 * 1024, // 64 MB
    timeCost: 2,
    parallelism: 1,
  });
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

  const passwordHash = await hashPassword(password);
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
        summary: blog.summary,
        isReleased: blog.isReleased,
        firstModDate: blog.firstModDate,
        lastModDate: blog.lastModDate,
        minutesToRead: blog.minutesToRead,
        tags: blog.tags,
        category: blog.category,
        mdxText: blog.mdxContentRaw,
      },
      create: {
        slug: blog.slug,
        title: blog.title,
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
