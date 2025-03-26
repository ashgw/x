"use client";

import type { ButtonHTMLAttributes } from "react";
import { useState } from "react";
import Link from "next/link";
import BackUpTop from "@/app/components/reusables/back-up-top";
import { motion } from "framer-motion";
import { CheckCheck, ChevronDown } from "lucide-react";

import type { PostData } from "~/lib/mdx";
import { PostCard } from "./Postcard";

interface PostsProps {
  posts: PostData[];
  taggedPostsFileNames?: string[];
}

export function Posts({ posts, taggedPostsFileNames }: PostsProps) {
  const firstLoadVisibleNum = 10;
  const perLoadVisibleNum = 5;
  const [visibleNum, setVisibleNum] = useState<number>(firstLoadVisibleNum);

  let filteredPosts: PostData[] = posts;
  if (taggedPostsFileNames && taggedPostsFileNames.length > 0) {
    filteredPosts = posts.filter((post) =>
      taggedPostsFileNames.includes(post.filename),
    );
  }
  const loadMore = visibleNum <= filteredPosts.length;

  return (
    <main>
      {filteredPosts
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
              y: -200,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: index < 5 ? index * 0.1 : index * 0.05,
            }}
          >
            <PostCard postData={post}></PostCard>
          </motion.div>
        ))}
      <div id="more" className="m-14 flex items-center justify-center">
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
      <BackUpTop />
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

type LoadMoreProps = {
  setVisible: (num: number) => void;
  visNum: number;
  perLoadVisNum: number;
};

const LoadMore: React.FC<LoadMoreProps> = (props) => {
  return (
    <Link href={"#more"}>
      <ChevronDown
        onClick={() => {
          props.setVisible(props.visNum + props.perLoadVisNum);
        }}
        className="mt-5 animate-bounce cursor-pointer"
      />
    </Link>
  );
};
