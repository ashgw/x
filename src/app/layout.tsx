import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Atkinson_Hyperlegible } from 'next/font/google';
import Providers from '@/app/components/providers/all';
import { pub } from '@/lib/env';
import Nav from './components/nav/nav';

import './globals.css';

const inter = Atkinson_Hyperlegible({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  // TODO: figure out SEO when finished
  metadataBase: new URL(pub.SITE_URL_PROD),
  title: 'ashgw',
  description: '...',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
