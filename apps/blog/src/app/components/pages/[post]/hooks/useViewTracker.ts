"use client";

import type { Optional } from "ts-roids";
import { useEffect, useRef } from "react";

import { logger } from "@ashgw/observability";

import { trpcClientSide } from "~/trpc/client";

interface UseViewTrackerProps {
  postSlug: string;
  enabled?: boolean;
  delay?: number; // Delay in milliseconds before tracking
}

export function useViewTracker({
  postSlug,
  enabled = true,
  delay = 3000, // 3 seconds default delay
}: UseViewTrackerProps) {
  const hasTracked = useRef(false);
  const timeoutRef = useRef<Optional<NodeJS.Timeout>>(null);

  const trackViewMutation = trpcClientSide.view.trackView.useMutation({
    onError: (error) => {
      logger.error("Failed to track view in mutation", {
        postSlug,
        error: error.message,
        shape: error.shape,
      });
    },
    onSuccess: () => {
      logger.info("Successfully tracked view in mutation", { postSlug });
    },
  });

  useEffect(() => {
    if (!enabled || !postSlug || hasTracked.current) {
      logger.info("View tracking skipped", {
        enabled,
        postSlug,
        hasTracked: hasTracked.current,
      });
      return;
    }

    // Check if we already tracked this post in this session
    const sessionKey = `view_tracked_${postSlug}`;
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey);

    if (alreadyTrackedInSession) {
      logger.info("View already tracked in session", { postSlug });
      return;
    }

    logger.info("Setting up view tracking", {
      postSlug,
      delay,
      hasTracked: hasTracked.current,
    });

    // Set up delayed tracking
    timeoutRef.current = setTimeout(() => {
      if (!hasTracked.current) {
        hasTracked.current = true;

        // Mark as tracked in session
        sessionStorage.setItem(sessionKey, "true");

        logger.info("Initiating view tracking", { postSlug });

        // Track the view
        trackViewMutation.mutate({ postSlug });
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        logger.info("Cleaning up view tracking timeout", { postSlug });
        clearTimeout(timeoutRef.current);
      }
    };
  }, [postSlug, enabled, delay, trackViewMutation]);

  return {
    isTracking: trackViewMutation.isPending,
    hasError: trackViewMutation.isError,
    error: trackViewMutation.error,
  };
}
