'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ReactProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ReactProps) {
  return (
    <NextThemesProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </NextThemesProvider>
  );
}
