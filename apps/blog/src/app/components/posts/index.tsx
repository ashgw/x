"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCheck } from "lucide-react";

import { Footer, Loading } from "@ashgw/components";

import type { PostData } from "~/lib/mdx";
import { usePostsContext } from "./components/Context";
import { PostCard } from "./components/Postcard";

interface PostsProps {
  posts: PostData[];
}

const CATEGORIES = ["Software", "Health", "Philosophy"] as const;
type Category = (typeof CATEGORIES)[number];

export function Posts({ posts }: PostsProps) {
  const { visibleNum, setVisibleNum, scrollPosition, setScrollPosition } =
    usePostsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreInView = useInView(loadMoreRef, { once: false });
  const perLoadVisibleNum = 5;

  const filteredPosts = posts
    .filter(
      (post) =>
        !selectedCategory ||
        post.parsedContent.attributes.category === selectedCategory,
    )
    .sort((b1, b2) => {
      const date1 = new Date(b1.parsedContent.attributes.firstModDate);
      const date2 = new Date(b2.parsedContent.attributes.firstModDate);
      return date2.getTime() - date1.getTime();
    });

  const loadMore = visibleNum <= filteredPosts.length;

  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition, setScrollPosition]);

  useEffect(() => {
    if (isLoadMoreInView && loadMore) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleNum((prev) => prev + perLoadVisibleNum);
        setIsLoading(false);
      }, 100);
    }
  }, [isLoadMoreInView, loadMore, setVisibleNum]);

  const CategoryButton = ({ category }: { category: Category }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`rounded-xl px-4 py-2 transition-all duration-200 ${
        selectedCategory === category
          ? "border border-white/30 bg-white/10 text-white"
          : "dimmed-3 hover:dimmed-4 border border-white/10 hover:border-white/40"
      }`}
    >
      {category}
    </button>
  );

  return (
    <main>
      <div className="flex justify-center gap-4 md:-mb-9 md:-mr-32">
        {CATEGORIES.map((category) => (
          <CategoryButton key={category} category={category} />
        ))}
      </div>

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
          isLoading ? (
            <Loading glowColor="rgba(255, 255, 255, 0.8)" />
          ) : null
        ) : (
          <div className="-mb-12 flex flex-col items-center justify-center">
            <CheckCheck className="mt-5 cursor-default" />
            <div className="py-10" />
            <Footer />
          </div>
        )}
      </div>
    </main>
  );
}
