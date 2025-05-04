import type { PostCategory } from "@ashgw/db/raw";

import type { PostDetailRo } from "../models";
import type { PostDetailQuery } from "../queries";
import { PostCategoryEnum } from "../models";

export class PostMapper {
  public static toDetailRo({ post }: { post: PostDetailQuery }): PostDetailRo {
    return {
      slug: post.slug,
      parsedContent: {
        attributes: {
          firstModDate: post.firstModDate.toISOString(),
          lastModDate: post.mdxContent.uploadedAt.toISOString(),
          isReleased: post.isReleased,
          minutesToRead: post.minutesToRead,
          seoTitle: post.seoTitle,
          summary: post.summary,
          tags: post.tags,
          title: post.title,
          category: this.mapCategory({
            category: post.category,
          }),
        },
        mdxContent: {
          uri: post.mdxContent.key,
        },
        bodyBegin: 0,
      },
    };
  }

  private static mapCategory({
    category,
  }: {
    category: PostCategory;
  }): PostCategoryEnum {
    switch (category) {
      case "HEALTH":
        return PostCategoryEnum.HEALTH;
      case "PHILOSOPHY":
        return PostCategoryEnum.PHILOSOPHY;
      case "SOFTWARE":
        return PostCategoryEnum.SOFTWARE;
    }
  }
}
