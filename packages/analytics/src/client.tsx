import type { PropsWithChildren } from "react";

import { PostHogProvider, usePostHog, PostHogFeature } from "./posthog/client";

export const AnalyticsProvider = ({
  children,
}: PropsWithChildren<NonNullable<unknown>>) => {
  return <PostHogProvider>{children}</PostHogProvider>;
};

export const useAnalytics = usePostHog;
export const AnalyticsFeature = PostHogFeature;
