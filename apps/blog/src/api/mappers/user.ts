import type { SessionRo, UserRo } from "../models";
import type { UserWithSessionsQuery } from "../query-helpers/user";
import { UserRoleEnum } from "../models";

export class UserMapper {
  public static toUserRo({
    user: { email, sessions, role, id, name, createdAt },
  }: {
    user: UserWithSessionsQuery;
  }): UserRo {
    return {
      id,
      email,
      name,
      createdAt,
      role: this._mapRole({ role }),
      sessions: this._mapSessions({
        sessions,
      }),
    };
  }

  private static _mapSessions({
    sessions,
  }: {
    sessions: UserWithSessionsQuery["sessions"];
  }): SessionRo[] {
    return sessions.map((session) => ({
      id: session.id,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }));
  }

  private static _mapRole({ role }: { role: string }): UserRoleEnum {
    switch (role) {
      case "ADMIN":
        return UserRoleEnum.ADMIN;
      case "VISITOR":
      default:
        return UserRoleEnum.VISITOR;
    }
  }
}
