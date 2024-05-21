import Providers from '@/app/components/providers/all';
import { pub } from '@/lib/env';
import { getSiteName } from '@/lib/funcs/site-name';
import type { Metadata } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';

import NavBar from './components/nav/nav';
import './styles/globals.css';

const font = Atkinson_Hyperlegible({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
});

const title = 'Ashref Gwader';
const description = 'Developer, writer, and modern day philosopher.';
const url = new URL(pub.SITE_URL_PROD);
const kw: string[] = ['blog', 'tech', 'TS', 'Python'];

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;
const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;

export const metadata: Metadata = {
  metadataBase: new URL(pub.SITE_URL_PROD),
  title: {
    default: 'Ashgw',
    template: '%s | Ashgw',
  },
  creator: 'Ashref Gwader',
  keywords: kw,
  description: 'Developer, writer, and modern day philosopher.',
  openGraph: {
    siteName: getSiteName(pub.SITE_URL_PROD) || pub.SITE_URL_PROD,
    locale: 'en_US',
    publishedTime: '2023-12-01T09:15:00-0401',
    title,
    description,
    type: 'article',
    url,
    images: [
      {
        url: postImageUrl,
        width: postImageWidth,
        height: postImageHeight,
        alt: title,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [postImageUrl],
  },
  category: 'tech',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <NavBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
