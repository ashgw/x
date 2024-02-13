import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/app/actions/blog';
import { getBlogPosts } from '@/app/api/blogs/content';
import LoadingScreen from '../loading';
import SEO from './_seo';
import BlogSection from './_blog-section';

export const generateStaticParams = async () => {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ post: post.filenameSlug }));
};

export default async function Blog({ params }: { params: { post: string } }) {
  const post = await getBlogPost(params.post);
  if (post) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <main className="pt-5">
          <SEO post={post} />
          <BlogSection post={post} />
        </main>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
