import Footer from '@/app/components/footer/footer';
import PostSection from '@/app/components/post/post-section';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import { pub } from '@/lib/env';
import { getSiteName } from '@/lib/funcs/site-name';
import { getBlogPost, getBlogPosts } from '@/lib/mdx/content';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { EmptyObject } from 'ts-roids';

type RouteParams = {
  params: { post: string };
};

export const generateStaticParams = async () => {
  const posts = await getBlogPosts();
  if (posts) {
    return posts.map((post) => ({ post: post.filename }));
  }
  return [];
};

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata | EmptyObject> {
  const post = await getBlogPost(params.post);
  if (!post) {
    return {};
  }
  const postAttrs = post.parsedContent.attributes;
  const title = postAttrs.title;
  const description = postAttrs.summary;
  const seoDescription = postAttrs.seoTitle;
  const url = pub.SITE_URL_PROD + '/' + post.filename;

  const postImageWidth = 1200; // in pixels
  const postImageHeight = 630;
  const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${description}`;
  return {
    title,
    description: seoDescription,
    openGraph: {
      siteName: getSiteName(pub.SITE_URL_PROD) || pub.SITE_URL_PROD,
      locale: 'en_US',
      publishedTime: postAttrs.firstModDate,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description: seoDescription,
      images: [postImageUrl],
    },
    creator: 'Ashref Gwader',
    keywords: postAttrs.tags,
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: pub.SITE_URL_PROD + '/manifest.json',
    category: 'tech',
  };
}

export default async function Blog({ params }: RouteParams) {
  const post = await getBlogPost(params.post);
  if (post) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <main className="pt-5">
          <PostSection post={post} />
        </main>
        <div className="py-10"></div>
        <Footer />
      </Suspense>
    );
  } else {
    return notFound();
  }
}
