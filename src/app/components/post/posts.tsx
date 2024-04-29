'use client';
import type { PostData } from '@/lib/types/mdx';
import type { ButtonHTMLAttributes } from 'react';
import PostCard from '@/app/components/post/post-card';
import { ChevronDown } from 'lucide-react';
import { CheckCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/app/components/footer/footer';

type Posts = { posts: PostData[] };
export default function Posts({ posts }: Posts) {
  const firstLoadVisibleNum = 5;
  const perLoadVisibleNum = 3;
  const [visibleNum, setVisibleNum] = useState<number>(firstLoadVisibleNum);
  const loadMore = visibleNum <= posts.length;

  return (
    <main>
      {posts
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
              y: -200, // y: index % 2 == 0 ? -200 : 200 , push for 5 when blogs are 20+
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
            <PostCard postData={post}></PostCard>
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
