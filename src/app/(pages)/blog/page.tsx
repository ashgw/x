import { Suspense } from 'react';
import { pub, nextJS } from '@/lib/env';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import { ChevronDown } from 'lucide-react';
import type { BlogData } from '@/lib/types/mdx';
import { notFound } from 'next/navigation';
import BlogPostCard from '@/app/components/blog/blog-card';
import { Maybe } from '@/lib/types/global';

async function getBlogPosts(): Promise<Maybe<BlogData[]>> {
  const SITE_URL =
    nextJS.NEXT_NODE_ENV == 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;
  try {
    const response = await fetch(SITE_URL + '/api/blogs', {
      next: { revalidate: 7200 },
    });
    if (response.status == 200) {
      const result: { blogs: BlogData[] } = await response.json();
      return result.blogs;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return;
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  if (blogPosts) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
          <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
            Unclassified, raw
          </h1>
          {blogPosts
            .sort((b1, b2) => {
              if (
                new Date(b1.parsedContent.attributes.firstModDate) >
                new Date(b2.parsedContent.attributes.firstModDate)
              ) {
                return -1;
              }
              return 1;
            })
            .map((post) => (
              <BlogPostCard
                key={post.filenameSlug}
                blogData={post}
              ></BlogPostCard>
            ))}
          <div className="flex items-center justify-center animate-bounce m-14 cursor-pointer">
            <ChevronDown className="mt-5" />
          </div>
          <div className="w-auto h-1"></div>
        </section>
      </Suspense>
    );
  }
}
