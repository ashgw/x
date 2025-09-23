"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
