import type { PostCategory } from "@ashgw/db/raw";

import type { MdxContentRo, PostCardRo, PostDetailRo } from "../models";
import type { PostCardQuery, PostDetailQuery } from "../query-helpers";
import { PostCategoryEnum } from "../models";

export class PostMapper {
  public static toCardRo({ post }: { post: PostCardQuery }): PostCardRo {
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
      category: this._mapCategory({
        category: post.category,
      }),
    };
  }

  public static toDetailRo({
    post,
    mdxContent,
  }: {
    post: PostDetailQuery;
    mdxContent: MdxContentRo;
  }): PostDetailRo {
    return {
      ...this.toCardRo({ post }),
      mdxContent: mdxContent,
    };
  }

  private static _mapCategory({
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
