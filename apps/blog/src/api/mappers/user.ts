import type { UserRo } from "../models";
import type { UserAuthQuery } from "../query-helpers/user";
import { UserRoleEnum } from "../models";
import { AppError } from "@ashgw/error";

export class UserMapper {
  public static toUserRo({ user }: { user: UserAuthQuery }): UserRo {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      updatedAt: user.updatedAt,
      image: user.image,
      role: this._mapRole({ role: user.role }),
    };
  }

  private static _mapRole({ role }: { role: string }): UserRoleEnum {
    const normalized = role.toLowerCase().trim();

    switch (normalized) {
      case "admin":
        return UserRoleEnum.ADMIN;
      case "visitor":
        return UserRoleEnum.VISITOR;
      default:
        throw new AppError({
          code: "INTERNAL",
          message: "Invalid role type, got: " + role,
        });
    }
  }
}
