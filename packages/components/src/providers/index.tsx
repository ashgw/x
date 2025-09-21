"use client";

import { NextUIProvider } from "@nextui-org/react";
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
        <NextUIProvider>{children}</NextUIProvider>
      </NextThemesProvider>
    </AnalyticsProvider>
  );
}
