"use client";

import type { ButtonHTMLAttributes } from "react";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCheck, ChevronDown } from "lucide-react";

import { Footer } from "@ashgw/components";

import type { PostData } from "~/lib/mdx";
import { usePostsContext } from "./components/Context";
import { PostCard } from "./components/Postcard";
import { ScrollUp } from "./components/ScrollUp";

interface PostsProps {
  posts: PostData[];
}

export function Posts({ posts }: PostsProps) {
  const { visibleNum, setVisibleNum, scrollPosition, setScrollPosition } =
    usePostsContext();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreInView = useInView(loadMoreRef, { once: false });

  const perLoadVisibleNum = 5;
  const filteredPosts = posts.sort((b1, b2) => {
    const date1 = new Date(b1.parsedContent.attributes.firstModDate);
    const date2 = new Date(b2.parsedContent.attributes.firstModDate);
    return date2.getTime() - date1.getTime();
  });

  const loadMore = visibleNum <= filteredPosts.length;

  // Restore scroll position and handle scroll events
  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition, setScrollPosition]);

  // Auto-load more posts when load more button comes into view
  useEffect(() => {
    if (isLoadMoreInView && loadMore) {
      setVisibleNum((prev) => prev + perLoadVisibleNum);
    }
  }, [isLoadMoreInView, loadMore, setVisibleNum, perLoadVisibleNum]);

  return (
    <main>
      {filteredPosts.slice(0, visibleNum).map((post, index) => (
        <motion.div
          key={post.filename}
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index < 5 ? index * 0.1 : index * 0.05,
          }}
        >
          <PostCard postData={post} />
        </motion.div>
      ))}
      <div ref={loadMoreRef} className="m-14 flex items-center justify-center">
        {loadMore ? (
          <LoadMore
            setVisible={setVisibleNum}
            visNum={visibleNum}
            perLoadVisNum={perLoadVisibleNum}
          />
        ) : (
          <NoMoreImTiredBoss />
        )}
      </div>
      <ScrollUp />
    </main>
  );
}

const NoMoreImTiredBoss: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = () => {
  return (
    <div className="-mb-12 flex flex-col items-center justify-center">
      <CheckCheck className="mt-5 cursor-default" />
      <div className="py-10"></div>
      <Footer />
    </div>
  );
};

const LoadMore: React.FC<{
  setVisible: (num: number) => void;
  visNum: number;
  perLoadVisNum: number;
}> = ({ setVisible, visNum, perLoadVisNum }) => {
  return (
    <button
      onClick={() => setVisible(visNum + perLoadVisNum)}
      className="flex items-center justify-center p-2 transition-transform hover:scale-110"
    >
      <ChevronDown className="mt-5 animate-bounce cursor-pointer" />
    </button>
  );
};
