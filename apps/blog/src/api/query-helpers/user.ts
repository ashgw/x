import type { Prisma } from "@ashgw/db/raw";

export type UserWithSessionsQuery = Prisma.UserGetPayload<{
  include: ReturnType<typeof UserQueryHelper.withSessionsInclude>;
}>;

export class UserQueryHelper {
  public static withSessionsInclude() {
    return {
      sessions: {
        select: {
          id: true,
          expiresAt: true,
          createdAt: true,
        },
      },
    } satisfies Prisma.UserInclude;
  }
}
