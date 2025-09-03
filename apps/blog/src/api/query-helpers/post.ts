import type { Prisma } from "@ashgw/db/raw";

export type PostCardQuery = Prisma.PostGetPayload<{
  select: ReturnType<typeof PostQueryHelper.cardSelect>;
}>;

export type PostDetailQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.detailInclude>;
}>;

export type PostAdminQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.adminInclude>;
}>;

export class PostQueryHelper {
  public static detailInclude() {
    return {
      ...this._withViews(),
    } satisfies Prisma.PostInclude;
  }

  public static cardSelect() {
    return {
      category: true,
      tags: true,
      title: true,
      slug: true,
      seoTitle: true,
      summary: true,
      firstModDate: true,
      lastModDate: true,
      isReleased: true,
      minutesToRead: true,
      postViews: { select: { id: true } },
    } satisfies Prisma.PostSelect;
  }

  public static adminInclude() {
    return {
      ...this.detailInclude(),
    } satisfies Prisma.PostInclude;
  }

  public static whereReleasedToPublic() {
    return {
      isReleased: true,
      firstModDate: { lte: new Date() },
    } satisfies Prisma.PostWhereInput;
  }

  private static _withViews() {
    return {
      postViews: { select: { id: true } },
    } satisfies Prisma.PostInclude & Prisma.PostSelect;
  }
}
