"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface PostsContextType {
  visibleNum: number;
  setVisibleNum: (num: number) => void;
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: PropsWithChildren) {
  const [visibleNum, setVisibleNum] = useState<number>(10); // firstLoadVisibleNum
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  return (
    <PostsContext.Provider
      value={{
        visibleNum,
        setVisibleNum,
        scrollPosition,
        setScrollPosition,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePostsContext() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
}
