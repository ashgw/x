import type { PostCategory as DbPostCategory } from "@ashgw/db/raw";

import type {
  fontMatterMdxContentRo,
  PostCardRo,
  PostDetailRo,
} from "../models";
import type { PostCardQuery, PostDetailQuery } from "../query-helpers";
import { PostCategoryEnum } from "../models";

export class PostMapper {
  public static toCardRo({ post }: { post: PostCardQuery }): PostCardRo {
    return {
      slug: post.slug,
      title: post.title,
      seoTitle: post.seoTitle,
      summary: post.summary,
      firstModDate: post.firstModDate,
      minutesToRead: post.minutesToRead,
      tags: post.tags,
      category: this._mapCategory({
        category: post.category,
      }),
      views: post.postViews.length,
    };
  }

  public static toDetailRo({
    post,
  }: {
    post: PostDetailQuery;
    fontMatterMdxContent: fontMatterMdxContentRo;
  }): PostDetailRo {
    return {
      ...this.toCardRo({ post }),
      lastModDate: post.lastModDate,
      isReleased: post.isReleased,
      slug: post.slug,
      fontMatterMdxContent: {
        body: post.mdxText,
        bodyBegin: 0,
      },
    };
  }

  private static _mapCategory({
    category,
  }: {
    category: DbPostCategory;
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
