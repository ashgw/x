"use client";

import { useState } from "react";
import { LockIcon } from "lucide-react";

import { Button } from "@ashgw/ui";

import { trpcClientSide } from "~/trpc/client";
import { LoginModal } from "../../../misc/LoginModal";

interface FormButtonsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

export function FormButtons({ onReset, isSubmitting }: FormButtonsProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: user, isLoading } = trpcClientSide.user.me.useQuery();

  const isLoggedIn = !!user;
  const showLoginButton = !isLoading && !isLoggedIn;

  return (
    <>
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
            onClick={() => setShowLoginModal(true)}
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
      {showLoginModal ? (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      ) : null}
    </>
  );
}
