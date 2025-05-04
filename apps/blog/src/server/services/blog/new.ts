import type { DatabaseClient } from "@ashgw/db";
import { db } from "@ashgw/db";

import { PostDataRo } from "~/server/models";

export class BlogService {
  constructor(private readonly db: DatabaseClient) {}

  public async getPost({ slug }: { slug: string }) {
    const post = await this.db.post.findUnique({
      where: {
        slug,
      },
      include: {
        uploads: true,
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    const uploads = post.uploads.map((upload) => {
      if (upload.type === "MDX") {
        return upload.url;
      }
    });
  }
}
