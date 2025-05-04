import type { Prisma } from "@ashgw/db/raw";

export type PostDetailQuery = Prisma.PostGetPayload<{
  include: ReturnType<typeof PostQueryHelper.detailInclude>;
}>;

export class PostQueryHelper {
  public static detailInclude() {
    return {
      ...this.includeWithMdx(),
    } satisfies Prisma.PostInclude;
  }

  private static includeWithMdx() {
    return {
      mdxContent: true,
    } satisfies Prisma.PostInclude;
  }
}

