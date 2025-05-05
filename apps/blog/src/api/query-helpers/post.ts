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
      ...this.includeWithMdx(),
    } satisfies Prisma.PostInclude;
  }

  public static cardInclude() {
    return {} satisfies Prisma.PostInclude;
  }

  private static includeWithMdx() {
    return {
      mdxContent: true,
    } satisfies Prisma.PostInclude;
  }
}
