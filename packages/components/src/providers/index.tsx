"use client";

import type { PropsWithChildren } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AnalyticsProvider } from "@ashgw/analytics/provider";

interface ProvidersProps extends PropsWithChildren {
  site: "blog" | "www";
}

export function Providers({ children, site }: ProvidersProps) {
  return (
    <AnalyticsProvider site={site}>
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
