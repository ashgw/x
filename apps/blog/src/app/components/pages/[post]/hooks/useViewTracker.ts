"use client";

import type { Optional } from "ts-roids";
import { useEffect, useRef } from "react";

import { logger } from "@ashgw/observability";

import { useStore } from "~/app/stores";
import { trpcClientSide } from "~/trpc/client";

interface UseViewTrackerProps {
  postSlug: string;
  enabled?: boolean;
  delay?: number;
}

export function useViewTracker({
  postSlug,
  enabled = true,
  delay = 3000, // 3 seconds default delay
}: UseViewTrackerProps) {
  const hasTracked = useRef(false);
  const timeoutRef = useRef<Optional<NodeJS.Timeout>>(null);
  const { store } = useStore();

  const trackViewMutation = trpcClientSide.view.trackView.useMutation({
    onMutate: () => {
      logger.debug("Starting view tracking mutation", { postSlug });
    },
    onError: (error) => {
      logger.error("Failed to track view in mutation", {
        postSlug,
        error: error.message,
        shape: error.shape,
      });
      // Reset tracking state on error so it can be retried
      hasTracked.current = false;
      sessionStorage.removeItem(`view_tracked_${postSlug}`);
    },
    onSuccess: () => {
      logger.debug("Successfully tracked view in mutation", { postSlug });
      const currentViews = store.views.getViews(postSlug);
      store.views.setViews(postSlug, currentViews + 1);
    },
  });

  useEffect(() => {
    if (!enabled || !postSlug) {
      logger.info("View tracking disabled or no slug", {
        enabled,
        postSlug,
      });
      return;
    }

    if (hasTracked.current) {
      logger.info("Already tracked in this render", { postSlug });
      return;
    }

    // Check if we already tracked this post in this session
    const sessionKey = `view_tracked_${postSlug}`;
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey);

    if (alreadyTrackedInSession) {
      logger.info("View already tracked in session storage", { postSlug });
      hasTracked.current = true;
      return;
    }

    logger.info("Setting up view tracking timeout", {
      postSlug,
      delay,
    });

    // Set up delayed tracking
    timeoutRef.current = setTimeout(() => {
      if (!hasTracked.current) {
        logger.info("Timeout elapsed, tracking view", { postSlug });
        hasTracked.current = true;

        // Track the view first
        trackViewMutation.mutate({ postSlug });

        // Only mark as tracked if mutation started successfully
        if (!trackViewMutation.isError) {
          sessionStorage.setItem(sessionKey, "true");
          logger.info("Marked as tracked in session storage", { postSlug });
        }
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        logger.info("Cleaning up view tracking timeout", { postSlug });
        clearTimeout(timeoutRef.current);
      }
    };
  }, [postSlug, enabled, delay, trackViewMutation, store.views]);

  return {
    isTracking: trackViewMutation.isPending,
    hasError: trackViewMutation.isError,
    error: trackViewMutation.error,
  };
}
