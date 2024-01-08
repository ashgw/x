'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <NextThemesProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </NextThemesProvider>
  );
}
