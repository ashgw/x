import type { DatabaseClient } from "@ashgw/db";

export class BlogService {
  constructor(private readonly db: DatabaseClient) {}

  public async getPost({ slug }: { slug: string }) {
    const post = await this.db.post.findUnique({
      where: {
        slug,
      },
      include: {
        mdxContent: {
          select: {
            url: true,
            key: true,
            size: true,
            type: true,
          },
        },
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
  }
}
