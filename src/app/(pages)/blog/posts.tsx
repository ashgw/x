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
    <button className="cursor-default">
      <CheckCheck className="mt-5" />
    </button>
  );
};

export default function BlogPosts({ blogPosts }: { blogPosts: BlogData[] }) {
  const firstLoadVisibleNum = 3;
  const perLoadVisibleNum = 1;
  let [visibleNum, setVisibleNum] = useState<number>(firstLoadVisibleNum);
  const loadMore = visibleNum <= blogPosts.length;

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
        .slice(0, visibleNum)
        .map((post) => (
          <BlogPostCard key={post.filenameSlug} blogData={post}></BlogPostCard>
        ))}
      <div className="flex items-center justify-center m-14">
        {loadMore ? (
          <button>
            <ChevronDown
              onClick={() => setVisibleNum(visibleNum + perLoadVisibleNum)}
              className="mt-5 animate-bounce cursor-pointer"
            />
          </button>
        ) : (
          <NoMoreImTiredBoss />
        )}
      </div>
    </>
  );
}
