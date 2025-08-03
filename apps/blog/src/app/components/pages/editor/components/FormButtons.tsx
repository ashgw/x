import Link from "next/link";

import { Button } from "@ashgw/ui";

import { UserRoleEnum } from "~/api/models";
import { useAuth } from "~/app/hooks";

interface FormButtonsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

export function FormButtons({ onReset, isSubmitting }: FormButtonsProps) {
  const { user } = useAuth();

  const isAdmin = user?.role === UserRoleEnum.ADMIN;

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="squared:outline"
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      {!user ? (
        <Link href="/login">
          <Button variant="squared:default" type="submit">
            Login to save
          </Button>
        </Link>
      ) : (
        <Button
          variant="squared:default"
          type="submit"
          disabled={!isAdmin || isSubmitting}
          loading={isAdmin && isSubmitting}
        >
          {isAdmin ? (isSubmitting ? "Saving..." : "Save") : "Admin Required"}
        </Button>
      )}
    </div>
  );
}
