import { Suspense } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import { ChevronDown } from 'lucide-react';
import BlogPostCard from '@/app/components/blog/blog-card';
import { getBlogPosts } from '@/app/actions/blog';

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
