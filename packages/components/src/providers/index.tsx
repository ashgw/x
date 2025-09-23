"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AnalyticsProvider } from "@ashgw/analytics/client";
import React from "react";

export function Providers({
  children,
}: React.PropsWithChildren<NonNullable<unknown>>) {
  return (
    <AnalyticsProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </AnalyticsProvider>
  );
}
