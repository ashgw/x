"use client";

import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

import { Button } from "@ashgw/ui";

import { trpcClientSide } from "~/trpc/client";

interface FormButtonsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

export function FormButtons({ onReset, isSubmitting }: FormButtonsProps) {
  const router = useRouter();
  const { data: user, isLoading } = trpcClientSide.user.me.useQuery();

  const isLoggedIn = !!user;
  const showLoginButton = !isLoading && !isLoggedIn;

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
