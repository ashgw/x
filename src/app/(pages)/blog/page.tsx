import Link from 'next/link';
import { Suspense } from 'react';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import FeaturedBlogPost from '@/app/not-found';
export const metadata = {
  title: 'Blog',
  description: 'Here is a list of all my blogs.',
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();
  return (
    <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        All my blogs are here, unclassified, raw
      </h1>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.parsedContent.attributes.firstModDate) >
            new Date(b.parsedContent.attributes.firstModDate)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <FeaturedBlogPost
            key={post.filenameSlug}
            blogData={post}
          ></FeaturedBlogPost>
        ))}
    </section>
  );
}
