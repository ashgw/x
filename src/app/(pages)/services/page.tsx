import Services from '@/app/(pages)/services/_services';
import { pub } from '@/lib/env';
import { getSiteName } from '@/lib/funcs/site-name';
import type { Metadata } from 'next';

const SERVICES_URL = new URL(pub.SITE_URL_PROD + '/services');
const CREATOR = 'Ashref Gwader';
const title = 'Services';
const description = 'Software Consulting. Custom Solutions.';
const url = SERVICES_URL;
const kw: string[] = [
  CREATOR,
  'ashgw',
  'services',
  'consulting',
  'training',
  'code audits',
];

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;
const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;

export const metadata: Metadata = {
  metadataBase: SERVICES_URL,
  title: {
    default: 'Services',
    template: '%s | Ashgw',
  },
  creator: CREATOR,
  keywords: kw,
  description: description,
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

export default function Component() {
  return <Services mainHeaderDescription={description} />;
}
