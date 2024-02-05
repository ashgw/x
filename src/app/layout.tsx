import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/components/providers/all';
import { pub } from '@/lib/env';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: '500' });

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
