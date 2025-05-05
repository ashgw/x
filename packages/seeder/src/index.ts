import { db } from "@ashgw/db";

// TODO: change this whole implementation in the newt PR since this is mad dumb G
export const seed = async () => {
  const mdxKey = "mdx/branded-types.mdx";
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

  // 2. Create the Post, referencing the Upload
  await db.post.create({
    data: {
      slug: "branded-types", // You need to provide a unique slug
      title: "Branded Types",
      seoTitle: "Write Safer TypeScript with Branded Types",
      summary: "Write safer TypeScript with branded types",
      isReleased: true,
      firstModDate: new Date("2024-04-27T09:15:00-04:01"),
      lastModDate: new Date("2024-04-27T09:15:00-04:01"),
      minutesToRead: 4,
      tags: ["typescript", "typing"],
      category: "SOFTWARE",
      mdxContentId: mdxKey,
    },
  });
};
