import type { Optional } from "ts-roids";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { logger } from "@ashgw/logger";

import type { UserRo } from "~/api/models";
import { trpcClientSide } from "~/trpc/callers/client";

interface UseAuthReturn {
  user: Optional<UserRo>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { data: user, isLoading } = trpcClientSide.user.me.useQuery();
  const utils = trpcClientSide.useUtils();
  const logoutMutation = trpcClientSide.user.logout.useMutation();

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      await utils.user.me.invalidate();
      router.refresh();
    } catch (error) {
      logger.error("Logout failed", { error });
    }
  }, [logoutMutation, router, utils.user.me]);

  return {
    user: user ?? null,
    isLoading,
    logout,
  };
}
