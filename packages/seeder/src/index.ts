import { db } from "@ashgw/db";
import { S3Service } from "@ashgw/services";

import { blogs } from "./data/blogs";

export const uploadFile = async () => {
  const s3Service = new S3Service();
  await s3Service.uploadFile({
    filename: "branded-types.mdx",
    folder: "mdx",
    body: Buffer.from(""),
    contentType: "text/markdown",
  });
};

export const seed = async () => {
  const s3Service = new S3Service();

  for (const blog of blogs) {
    const mdxKey = `mdx/${blog.slug}.mdx`;

    // 1. Upload MDX file to S3
    await s3Service.uploadFile({
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
