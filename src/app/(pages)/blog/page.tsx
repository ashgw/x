import { Suspense } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import BlogPosts from './posts';
import { getBlogPosts } from '@/app/actions/blog';
import { notFound } from 'next/navigation';

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  if (blogPosts) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
          <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
            Unclassified, raw
          </h1>
          <BlogPosts blogPosts={blogPosts} />
          <div className="w-auto h-full"></div>
        </section>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
