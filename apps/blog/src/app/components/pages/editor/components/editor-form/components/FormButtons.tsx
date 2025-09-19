import Link from "next/link";
import { Lock, LogIn } from "lucide-react";

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
            <LogIn className="mr-2 h-4 w-4" />
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
          {isAdmin ? (
            <>{isSubmitting ? "Saving..." : "Save"}</>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Not permitted
            </>
          )}
        </Button>
      )}
    </div>
  );
}
