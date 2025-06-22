"use client";

import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

import { Button } from "@ashgw/ui";

import { useAuth } from "~/app/hooks/auth";

interface FormButtonsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

// TODO: fix this eslint error
export function FormButtons({ onReset, isSubmitting }: FormButtonsProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const showLoginButton = !isLoading && !!user;

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="squared:outline"
        type="button"
        onClick={onReset}
        disabled={isSubmitting ?? false}
      >
        Cancel
      </Button>

      {showLoginButton ? (
        <Button
          variant="squared:default"
          type="button"
          onClick={() => router.push("/login")}
        >
          <LockIcon className="mr-2 h-4 w-4" />
          Login to Save
        </Button>
      ) : (
        <Button
          variant="squared:default"
          type="submit"
          disabled={(isSubmitting ?? false) || isLoading}
          loading={isSubmitting ?? false}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
}
