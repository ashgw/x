"use client";

import { Crown, User } from "@ashgw/design/icons";

import { Badge } from "@ashgw/design/ui";

import type { UserRo } from "~/api/models";
import { UserRoleEnum } from "~/api/models";

interface UserInfoProps {
  user: UserRo;
}

export function UserInfo({ user }: UserInfoProps) {
  const isAdmin = user.role === UserRoleEnum.ADMIN;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-muted-foreground text-sm font-semibold font-medium">
          Email
        </label>
        <p className="mt-1">{user.email}</p>
      </div>

      <div>
        <label className="text-muted-foreground text-sm font-semibold font-medium">
          Name
        </label>
        <p className="mt-1">{user.name}</p>
      </div>

      <div>
        <label className="text-muted-foreground text-sm font-semibold font-medium">
          Role
        </label>
        <div className="mt-2 flex items-center gap-2">
          <Badge
            appearance={"outline"}
            tone={isAdmin ? "warning" : "neutral"}
            className={`flex items-center gap-1.5 px-3 py-1`}
          >
            {isAdmin ? (
              <Crown className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
            {user.role.toLowerCase()}
          </Badge>
          {isAdmin ? (
            <span className="text-muted-foreground text-xs">
              Full access to the admin panel
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <label className="text-muted-foreground text-sm font-semibold font-medium">
          Member Since
        </label>
        <p className="mt-1">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
