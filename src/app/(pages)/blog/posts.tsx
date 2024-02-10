'use client';
import type { BlogData } from '@/lib/types/mdx';
import BlogPostCard from '@/app/components/blog/blog-card';
import { ChevronDown } from 'lucide-react';
import { CheckCheck } from 'lucide-react';
import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

const NoMoreImTiredBoss: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = () => {
  return (
    <button>
      <CheckCheck className="mt-5 cursor-default" />
    </button>
  );
};

export default function BlogPosts({ blogPosts }: { blogPosts: BlogData[] }) {
  let [numVisible, setNumVisible] = useState<number>(2);
  const loadMore = numVisible !== 4;

  return (
    <>
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
        .slice(0, numVisible)
        .map((post) => (
          <BlogPostCard key={post.filenameSlug} blogData={post}></BlogPostCard>
        ))}
      <div className="flex items-center justify-center m-14">
        {loadMore ? (
          <button>
            <ChevronDown
              onClick={() => setNumVisible(numVisible + 1)}
              className="mt-5 animate-bounce  cursor-pointer"
            />
          </button>
        ) : (
          <NoMoreImTiredBoss />
        )}
      </div>
    </>
  );
}
