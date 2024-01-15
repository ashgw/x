import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/components/providers/all';

import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ashgw',
  description: '...', // figure out SEO later
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
