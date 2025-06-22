import type { Prisma } from "@ashgw/db/raw";

export type UserWithSessionsQuery = Prisma.UserGetPayload<{
  include: ReturnType<typeof UserQueryHelper.withSessionsInclude>;
}>;

export class UserQueryHelper {
  public static withSessionsInclude() {
    return {
      sessions: {
        select: this._sessionSelect(),
      },
    } satisfies Prisma.UserInclude;
  }

  private static _sessionSelect() {
    return {
      expiresAt: true,
      id: true,
    } satisfies Prisma.SessionSelect;
  }
}
