import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/lib/mdx/content';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import Posts from '@/app/components/post/posts';

type RouteParams = {
  params: { tag: string };
};

export default async function Tags({ params }: RouteParams) {
  const posts = await getBlogPosts();
  const taggedPostsFileNames: string[] = [];
  posts.forEach((post) => {
    if (post.parsedContent.attributes.tags.includes(params.tag)) {
      taggedPostsFileNames.push(post.filename);
    }
  });
  if (taggedPostsFileNames.length > 0) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
          <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
            Unclassified, raw
          </h1>
          <Posts posts={posts} taggedPostsFileNames={taggedPostsFileNames} />
          <div className="w-auto h-full"></div>
        </section>
        <div className="py-6"></div>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
