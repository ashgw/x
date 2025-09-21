import { PostHogProvider, usePostHog, PostHogFeature } from "./posthog/client";

export const AnalyticsProvider = PostHogProvider;
export const useAnalytics = usePostHog;
export const AnalyticsFeature = PostHogFeature;
