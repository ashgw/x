import type { Prisma } from "@ashgw/db/raw";

export type PostDetailQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.detailInclude>;
}>;

export type PostCardQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.cardInclude>;
}>;

export class PostQueryHelper {
  public static detailInclude() {
    return {
      ...this.cardInclude(),
      ...this._includeWithMdx(),
    } satisfies Prisma.PostInclude;
  }

  public static cardInclude() {
    return {} satisfies Prisma.PostInclude;
  }

  public static whereReleasedToPublic() {
    return {
      isReleased: true,
      firstModDate: {
        lte: new Date(), // I might finish the blog before the release date
      },
    } satisfies Prisma.PostWhereInput;
  }

  private static _includeWithMdx() {
    return {
      mdxContent: true,
    } satisfies Prisma.PostInclude;
  }
}
