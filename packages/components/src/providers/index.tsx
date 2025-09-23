"use client";

import { AnalyticsProvider } from "@ashgw/analytics/client";
import React from "react";

export function Providers({
  children,
}: React.PropsWithChildren<NonNullable<unknown>>) {
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}
