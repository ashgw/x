"use client";

import { useEffect } from "react";

import { useStore } from "~/app/stores";
import { trpcClientSide } from "~/trpc/callers/client";

export function useEditorQueries() {
  const { store } = useStore();

  const postsQuery = trpcClientSide.post.getAllAdminPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "active",
  });

  const trashedQuery = trpcClientSide.post.getTrashedPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "trash",
  });

  // Keep MobX store in sync
  useEffect(() => {
    if (postsQuery.data) store.editor.setActivePosts(postsQuery.data);
  }, [postsQuery.data, store.editor]);

  useEffect(() => {
    if (trashedQuery.data) store.editor.setTrashedPosts(trashedQuery.data);
  }, [trashedQuery.data, store.editor]);

  return {
    postsQuery,
    trashedQuery,
    activePosts: store.editor.activePosts,
    trashedPosts: store.editor.trashedPosts,
    viewMode: store.editor.viewMode,
  };
}
