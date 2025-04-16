"use client";

import type { UnionToTuple } from "ts-roids";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, ChevronDown } from "lucide-react";

import { Footer } from "@ashgw/components";

import type { PostDataRo } from "~/server/models";
import { usePostsContext } from "./components/Context";
import { PostCard } from "./components/Postcard";

interface PostsProps {
  posts: PostDataRo[];
}

type Category = "Software" | "Health" | "Philosophy";

const CATEGORIES: UnionToTuple<Category> = ["Software", "Health", "Philosophy"];

export function Posts({ posts }: PostsProps) {
  const { visibleNum, setVisibleNum } = usePostsContext();
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Software");
  const [shouldScroll, setShouldScroll] = useState(false);

  const perLoadVisibleNum = 5;

  const filteredPosts = posts
    .filter(
      (post) =>
        post.parsedContent.attributes.category ===
        selectedCategory.toLowerCase(),
    )
    .sort((b1, b2) => {
      const date1 = new Date(b1.parsedContent.attributes.firstModDate);
      const date2 = new Date(b2.parsedContent.attributes.firstModDate);
      return date2.getTime() - date1.getTime();
    });

  const hasMatches = filteredPosts.length > 0;
  const hasMorePosts = visibleNum < filteredPosts.length;

  useEffect(() => {
    if (shouldScroll) {
      const lastPost = document.querySelector(
        `[data-post-index="${visibleNum - 1}"]`,
      );
      lastPost?.scrollIntoView({ behavior: "smooth", block: "start" });
      setShouldScroll(false);
    }
  }, [visibleNum, shouldScroll]);

  function handleShowMore() {
    setVisibleNum((prev) => prev + perLoadVisibleNum);
    setShouldScroll(true);
  }

  function CategoryButton({ category }: { category: Category }) {
    return (
      <button
        onClick={() => setSelectedCategory(category)}
        className={`rounded-xl px-4 py-2 transition-all duration-200 ${
          selectedCategory === category
            ? "border border-white/30 bg-white/5 text-white"
            : "dimmed-3 hover:dimmed-4 border border-white/10 hover:border-white/40"
        }`}
      >
        {category}
      </button>
    );
  }

  return (
    <main>
      <div className="flex justify-center gap-4 md:-mb-9 md:-mr-32">
        {CATEGORIES.map((category) => (
          <CategoryButton key={category} category={category} />
        ))}
      </div>

      {hasMatches ? (
        <>
          {filteredPosts.slice(0, visibleNum).map((post, index) => (
            <motion.div
              key={post.filename}
              data-post-index={index}
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

          <div id="more" className="m-14 flex items-center justify-center">
            {hasMorePosts ? (
              <button
                onClick={handleShowMore}
                className="cursor-pointer transition-transform hover:scale-150"
              >
                <ChevronDown className="mt-5 scale-125 animate-bounce cursor-pointer" />
              </button>
            ) : (
              <div className="-mb-12 flex flex-col items-center justify-center">
                <CheckCheck className="mt-5 cursor-default" />
                <div className="py-10" />
                <Footer />
              </div>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="dimmed-3 mt-32 text-center"
        >
          No matches found
        </motion.div>
      )}
    </main>
  );
}
