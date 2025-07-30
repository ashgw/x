import { pbkdf2Sync, randomBytes } from "crypto";
import pkg from "aws-sdk";

import { db } from "@ashgw/db";
import { env } from "@ashgw/env";

import { blogs } from "./data/blogs";

const s3 = new pkg.S3({
  region: env.S3_BUCKET_REGION,
  accessKeyId: env.S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: env.S3_BUCKET_SECRET_KEY,
});

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
    console.error("Admin user already exists");
    return;
  }

  const passwordHash = hashPassword(password);
  await db.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: "ADMIN",
    },
  });

  // eslint-disable-next-line no-restricted-syntax
  console.log("Admin user created successfully");
}

async function uploadFileRaw({
  filename,
  folder,
  body,
  contentType,
}: {
  filename: string;
  folder: "mdx";
  body: Buffer;
  contentType: string;
}) {
  await s3
    .putObject({
      Bucket: env.S3_BUCKET_NAME,
      Key: `${folder}/${filename}`,
      Body: body,
      ContentType: contentType,
    })
    .promise();
}

export const seed = async () => {
  const mdxFolder = "mdx";
  for (const blog of blogs) {
    await uploadFileRaw({
      filename: `${blog.slug}.mdx`,
      folder: mdxFolder,
      body: Buffer.from(blog.mdxContentRaw, "utf-8"),
      contentType: "text/markdown",
    });
    const mdxKey = `${mdxFolder}/${blog.slug}.mdx`; // AKA the Upload table primary key

    await db.upload.upsert({
      where: { key: mdxKey },
      update: {},
      create: {
        key: mdxKey,
        type: "MDX",
        entityType: "POST",
        contentType: "text/markdown",
      },
    });

    await db.post.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        seoTitle: blog.seoTitle,
        summary: blog.summary,
        isReleased: blog.isReleased,
        firstModDate: blog.firstModDate,
        lastModDate: blog.lastModDate,
        minutesToRead: blog.minutesToRead,
        tags: blog.tags,
        category: blog.category,
        mdxContentId: mdxKey,
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
        mdxContentId: mdxKey,
      },
    });
  }
};

async function main() {
  await createAdminUser();
  await seed();
}

main().catch((error) => {
  // eslint-disable-next-line no-restricted-syntax
  console.error("Error in main execution:", error);
  process.exit(1);
});
