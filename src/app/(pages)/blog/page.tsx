import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronDown } from 'lucide-react';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import BlogPostCard from '@/app/components/blog/blog-card';
export const metadata = {
  title: 'Blog',
  description: 'Here is a list of all my blogs.',
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();
  return (
    <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
      <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
        Unclassified, raw
      </h1>
      {allBlogs
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
          <BlogPostCard key={post.filenameSlug} blogData={post}></BlogPostCard>
        ))}
      <div className="flex items-center justify-center animate-bounce m-14 cursor-pointer">
        <ChevronDown />
      </div>
      <div className="w-6 h-2"></div>
    </section>
  );
}
