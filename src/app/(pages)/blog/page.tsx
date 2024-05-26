import Posts from '@/app/components/post/posts';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import { pub } from '@/lib/env';
import { getSiteName } from '@/lib/funcs/site-name';
import { getBlogPosts } from '@/lib/mdx/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const PAGE_URL = new URL(pub.SITE_URL_PROD + '/blog');
const creator = 'Ashref Gwader';
const title = 'Blog';
const description = 'All about tech';
const kw: string[] = [creator, 'ashgw', 'blog'];

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

export default async function BlogPage() {
  const posts = await getBlogPosts();

  if (posts) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
          <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
            Unclassified, raw
          </h1>
          <Posts posts={posts} />
          <div className="w-auto h-full"></div>
        </section>
        <div className="py-6"></div>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
