"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useStore } from "~/app/stores";
import { trpcClientSide } from "~/trpc/callers/client";
import type { PostArticleRo } from "~/api/models/post";

export function useEditorData() {
  const { store } = useStore();
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blog");

  const activePosts = trpcClientSide.post.getAllAdminPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "active",
  });

  const trashedPosts = trpcClientSide.post.getTrashedPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "trash",
  });

  const specificPost = trpcClientSide.post.getDetailedPublicPost.useQuery(
    { slug: blogSlug ?? "" },
    {
      enabled:
        !!blogSlug &&
        activePosts.isSuccess &&
        !_findBlogInPosts(activePosts.data, blogSlug),
      retry: 1,
    },
  );

  useEffect(() => {
    if (activePosts.data) store.editor.setActivePosts(activePosts.data);
  }, [activePosts.data, store.editor]);

  useEffect(() => {
    if (trashedPosts.data) store.editor.setTrashedPosts(trashedPosts.data);
  }, [trashedPosts.data, store.editor]);

  const blogFromUrl = blogSlug
    ? (_findBlogInPosts(activePosts.data, blogSlug) ?? specificPost.data)
    : null;

  return {
    posts: store.editor.activePosts,
    trashedPosts: store.editor.trashedPosts,
    viewMode: store.editor.viewMode,
    blogFromUrl,
    blogSlug,
    isLoadingPosts: activePosts.isLoading,
    isLoadingTrashed: trashedPosts.isLoading,
    isLoadingSpecificPost: specificPost.isLoading && !!blogSlug,
    postsError: activePosts.error?.message,
    utils: trpcClientSide.useUtils(),
  };
}

function _findBlogInPosts(
  posts: PostArticleRo[] | undefined,
  slug: string,
): PostArticleRo | undefined {
  return posts?.find((post) => post.slug === slug);
}
