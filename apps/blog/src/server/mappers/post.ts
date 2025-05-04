import type { Post, PostCategory } from "@ashgw/db/raw";

import type { PostDataRo } from "../models";

export class PostMapper {
  public static ro({ post }: { post: Post }): PostDataRo {
    return {
      filename: post.slug,
      parsedContent: {
        attributes: {
          firstModDate: post.firstModDate.toISOString(),
          isReleased: post.isReleased,
          isSequel: false, // TODO: remove this on submit
          lastModDate: post.lastModDate.toISOString(),
          minutesToRead: post.minutesToRead,
          seoTitle: post.seoTitle,
          summary: post.summary,
          tags: post.tags,
          title: post.title,
          category: this.mapCategory(post.category),
        },
        body: "TODO: fill this actually",
        bodyBegin: 0,
      },
    };
  }
  private static mapCategory(
    category: PostCategory,
  ): PostDataRo["parsedContent"]["attributes"]["category"] {
    switch (category) {
      case "HEALTH":
        return "health";
      case "PHILOSOPHY":
        return "philosophy";
      case "SOFTWARE":
        return "software";
    }
  }
}
