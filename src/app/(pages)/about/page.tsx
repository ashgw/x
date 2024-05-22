import About from '@/app/(pages)/about/_about';
import { pub } from '@/lib/env';
import { getSiteName } from '@/lib/funcs/site-name';
import type { Metadata } from 'next';

const PAGE_URL = new URL(pub.SITE_URL_PROD + '/about');
const creator = 'Ashref Gwader';
const title = 'About';
const description = "I'm a software developer and technical educator";
const kw: string[] = [creator, 'ashgw', 'about'];

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;
const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;

export const metadata: Metadata = {
  metadataBase: PAGE_URL,
  title: {
    default: title,
    template: '%s | Ashgw',
  },
  creator: creator,
  keywords: kw,
  description: description,
  openGraph: {
    siteName: getSiteName(pub.SITE_URL_PROD) || pub.SITE_URL_PROD,
    locale: 'en_US',
    publishedTime: '2023-12-01T09:15:00-0401',
    title,
    description,
    type: 'article',
    url: PAGE_URL,
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

export default function Page() {
  return (
    <>
      <About />
    </>
  );
}
