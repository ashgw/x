import type { UserRo } from "~/api/models";

interface UserInfoProps {
  user: UserRo;
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-muted-foreground text-sm font-medium">
          Email
        </label>
        <p className="mt-1">{user.email}</p>
      </div>
      <div>
        <label className="text-muted-foreground text-sm font-medium">
          Name
        </label>
        <p className="mt-1">{user.name}</p>
      </div>
      <div>
        <label className="text-muted-foreground text-sm font-medium">
          Role
        </label>
        <p className="mt-1 capitalize">{user.role.toLowerCase()}</p>
      </div>
      <div>
        <label className="text-muted-foreground text-sm font-medium">
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
