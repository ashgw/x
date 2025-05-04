import type { PostCategory } from "@ashgw/db/raw";

import type { PostDetailRo } from "../models";
import type { PostDetailQuery } from "../query-helpers";
import { PostCategoryEnum } from "../models";

export class PostMapper {
  public static toDetailRo({
    post,
  }: {
    post: PostDetailQuery;
    mdxBodyContent: string;
  }): PostDetailRo {
    return {
      slug: post.slug,
      title: post.title,
      seoTitle: post.seoTitle,
      summary: post.summary,
      firstModDate: post.firstModDate.toISOString(),
      lastModDate: post.lastModDate.toISOString(),
      isReleased: post.isReleased,
      minutesToRead: post.minutesToRead,
      tags: post.tags,
      category: this.mapCategory({
        category: post.category,
      }),
      mdxContent: {
        bodyBegin: 0,
        body: post.mdxContent.key,
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
