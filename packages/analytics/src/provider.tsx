import type { PropsWithChildren } from "react";

import { env } from "@ashgw/env";

import { GoogleAnalytics } from "./google";
import { PostHogProvider } from "./posthog/client";

export const AnalyticsProvider = ({
  children,
  site,
}: PropsWithChildren<
  NonNullable<{
    site: "www" | "blog";
  }>
>) => {
  const gaId =
    site === "www"
      ? env.NEXT_PUBLIC_WWW_GOOGLE_ANALYTICS_ID
      : env.NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID;

  return (
    <PostHogProvider>
      {children}
      <GoogleAnalytics gaId={gaId} />
    </PostHogProvider>
  );
};
