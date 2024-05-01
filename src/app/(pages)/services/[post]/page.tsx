import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBusinessPosts, getBusinessPost } from '@/lib/mdx/content';
import { getSiteName } from '@/lib/funcs/site-name';
import { pub } from '@/lib/env';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import PostSection from '@/app/components/post/post-section';
import Footer from '@/app/components/footer/footer';
import { EmptyObject } from 'ts-roids';

type RouteParams = {
  params: { post: string };
};
type NoMetadata = EmptyObject;

export const generateStaticParams = async () => {
  const posts = await getBusinessPosts();
  if (posts) {
    return posts.map((post) => ({ post: post.filename }));
  }
  return [];
};

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata | NoMetadata> {
  const post = await getBusinessPost(params.post);
  if (!post) {
    return {};
  }
  const postAttrs = post.parsedContent.attributes;
  const title = postAttrs.seoTitle;
  const description = postAttrs.summary;
  const url = pub.SITE_URL_PROD + '/' + post.filename;

  const postImageWidth = 1200; // in pixels
  const postImageHeight = 630;
  const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;
  return {
    title,
    description,
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
      description,
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
    category: 'everything',
  };
}

export default async function Page({ params }: RouteParams) {
  const post = await getBusinessPost(params.post);
  if (post) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <main className="pt-5">
          <PostSection post={post} forBusiness={true} />
        </main>
        <div className="py-10"></div>
        <Footer />
      </Suspense>
    );
  } else {
    return notFound();
  }
}
