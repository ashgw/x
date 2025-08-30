import type { Prisma } from "@ashgw/db/raw";

export type PostCardQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.cardInclude>;
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
      ...this.cardInclude(),
      ...this._includeWithMdx(),
    } satisfies Prisma.PostInclude;
  }

  public static cardInclude() {
    return {
      postViews: {
        select: {
          id: true,
        },
      },
    } satisfies Prisma.PostInclude;
  }

  public static adminInclude() {
    return {
      ...this.detailInclude(),
    } satisfies Prisma.PostInclude;
  }

  public static whereReleasedToPublic() {
    return {
      isReleased: true,
      firstModDate: {
        lte: new Date(),
      },
    } satisfies Prisma.PostWhereInput;
  }

  private static _includeWithMdx() {
    return {
      mdxContent: {
        select: {
          key: true,
        },
      },
    } satisfies Prisma.PostInclude;
  }
}
