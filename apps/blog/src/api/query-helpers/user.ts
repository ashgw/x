import type { Prisma } from "@ashgw/db/raw";

export type UserWithSessionsQuery = Prisma.UserGetPayload<{
  include: ReturnType<typeof UserQueryHelper.withSessionsInclude>;
}>;

export type SessionQuery = Prisma.SessionGetPayload<{
  select: ReturnType<typeof UserQueryHelper.sessionSelect>;
}>;

export class UserQueryHelper {
  public static withSessionsInclude() {
    return {
      sessions: {
        select: this.sessionSelect(),
      },
    } satisfies Prisma.UserInclude;
  }

  public static sessionSelect() {
    return {
      expiresAt: true,
      id: true,
    } satisfies Prisma.SessionSelect;
  }

  // public static activeSessionWhere() {
  //   return {
  //     expiresAt: {
  //       gt: new Date(),
  //     },
  //   } satisfies Prisma.SessionWhereInput;
  // }
}
