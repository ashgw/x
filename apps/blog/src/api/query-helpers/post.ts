import type { Prisma } from "@ashgw/db/raw";

export type PostDetailQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.detailInclude>;
}>;

export type PostCardQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.cardInclude>;
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
    // intentionally returns no relations for card list views
    return {} satisfies Prisma.PostInclude;
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
      mdxContent: true,
    } satisfies Prisma.PostInclude;
  }
}
