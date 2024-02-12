import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPost } from '@/app/actions/blog';
import LoadingScreen from '../loading';
import SEO from './_seo';
import BlogSection from './_blog-section';

export default async function Blog({ params }: { params: { post: string } }) {
  const post = await getPost(params.post);
  if (post !== undefined) {
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
