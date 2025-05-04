import type { PostCategory } from "@ashgw/db/raw";

import type { MdxContentRo, PostDetailRo } from "../models";
import type { PostDetailQuery } from "../query-helpers";
import { PostCategoryEnum } from "../models";

export class PostMapper {
  public static toDetailRo({
    post,
    mdxContent,
  }: {
    post: PostDetailQuery;
    mdxContent: MdxContentRo;
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
      mdxContent: mdxContent,
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
