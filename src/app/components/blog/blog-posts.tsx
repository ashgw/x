'use client';
import type { BlogData } from '@/lib/types/mdx';
import BlogPostCard from '@/app/components/blog/blog-card';
import { ChevronDown } from 'lucide-react';
import { CheckCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/app/components/footer/footer';

const NoMoreImTiredBoss: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = () => {
  return (
    <div className="flex flex-col items-center justify-center -mb-12">
      <CheckCheck className="mt-5 cursor-default" />
      <div className="py-10"></div>
      <Footer />
    </div>
  );
};

export default function BlogPosts({ blogPosts }: { blogPosts: BlogData[] }) {
  const firstLoadVisibleNum = 2;
  const perLoadVisibleNum = 1;
  const [visibleNum, setVisibleNum] = useState<number>(firstLoadVisibleNum);
  const loadMore = visibleNum <= blogPosts.length;

  return (
    <main>
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
        .map((post, index) => (
          <motion.div
            key={post.filename}
            initial={{
              opacity: 0,
              y: -200, // y: index % 2 == 0 ? -200 : 200 , push for 5 wehn blogs are 20+
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
          >
            <BlogPostCard blogData={post}></BlogPostCard>
          </motion.div>
        ))}
      <div id="more" className="flex items-center justify-center m-14">
        {loadMore ? (
          <Link href={'#more'}>
            <ChevronDown
              onClick={() => {
                setVisibleNum(visibleNum + perLoadVisibleNum);
              }}
              className="mt-5 animate-bounce cursor-pointer"
            />
          </Link>
        ) : (
          <NoMoreImTiredBoss />
        )}
      </div>
    </main>
  );
}
