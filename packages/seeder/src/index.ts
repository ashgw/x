import pkg from "aws-sdk";

import { db } from "@ashgw/db";
import { env } from "@ashgw/env";

import { blogs } from "./data/blogs";

const s3 = new pkg.S3({
  region: env.S3_BUCKET_REGION,
  accessKeyId: env.S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: env.S3_BUCKET_SECRET_KEY,
});

async function uploadFileRaw({
  filename,
  folder,
  body,
  contentType,
}: {
  filename: string;
  folder: string;
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

export const uploadFile = async () => {
  await uploadFileRaw({
    filename: "branded-types.mdx",
    folder: "mdx",
    body: Buffer.from(""),
    contentType: "text/markdown",
  });
};

export const seed = async () => {
  for (const blog of blogs) {
    const mdxKey = `mdx/${blog.slug}.mdx`;

    // 1. Upload MDX file to S3
    await uploadFileRaw({
      filename: `${blog.slug}.mdx`,
      folder: "mdx",
      body: Buffer.from(blog.mdxContentRaw, "utf-8"),
      contentType: "text/markdown",
    });

    // 2. Upsert Upload record
    await db.upload.upsert({
      where: { key: mdxKey },
      update: {},
      create: {
        key: mdxKey,
        type: "MDX",
        entityType: "POST",
        contentType: "text/markdown",
        // uploadedAt will default to now()
      },
    });

    // 3. Upsert Post record
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
