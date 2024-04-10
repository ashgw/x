import { Suspense } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import Posts from '@/app/components/post/posts';
import { getBlogPosts } from '../../../lib/mdx/content';
import { notFound } from 'next/navigation';
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
