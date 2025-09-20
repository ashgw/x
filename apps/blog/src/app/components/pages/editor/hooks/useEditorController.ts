"use client";

import { useCallback, useState, useMemo } from "react";

import type { Optional } from "ts-roids";

import type { PostArticleRo } from "~/api/models/post";

import { useFilteredAndSortedBlogs } from "./useFilteredAndSortedBlogs";
import { useQueryParamBlog } from "./useQueryParamBlog";
import { useEditorForm } from "./useEditorForm";
import { useEditorModals } from "./useEditorModals";
import { useEditorMutations } from "./useEditorMutations";
import { useEditorQueries } from "./useEditorQueries";
import { useEditorUIState } from "./useEditorUIState";
import { useEditorHandlers } from "./useEditorHandlers";

export type UseEditorControllerReturn = ReturnType<typeof useEditorController>;

export function useEditorController() {
  const [selectedBlog, setSelectedBlog] =
    useState<Optional<PostArticleRo>>(null);

  // Compose focused hooks
  const form = useEditorForm();
  const modals = useEditorModals();
  const queries = useEditorQueries();
  const uiState = useEditorUIState();

  // Helper to reset to new blog
  const handleNewBlog = useCallback(() => {
    setSelectedBlog(null);
    modals.closeEditModal();
    form.resetForm();
    const url = new URL(window.location.href);
    url.searchParams.delete("blog");
    window.history.replaceState({}, "", url.toString());
  }, [form, modals, setSelectedBlog]);

  const handleTrashSuccess = useCallback(() => {
    modals.closeDeleteModal();
    // If we're deleting the currently edited blog, reset to new blog
    if (
      modals.editModal.visible &&
      modals.deleteModal.visible &&
      modals.editModal.entity.slug === modals.deleteModal.entity.slug
    ) {
      handleNewBlog();
    }
  }, [modals, handleNewBlog]);

  const handleTrashError = useCallback(() => {
    modals.setIsTrashingBlog(false);
  }, [modals]);

  // Setup mutations with callbacks
  const mutations = useEditorMutations({
    onCreateSuccess: handleNewBlog,
    onUpdateSuccess: handleNewBlog,
    onTrashSuccess: handleTrashSuccess,
    onTrashError: handleTrashError,
  });

  // Compose handlers (but override handleNewBlog with our local version)
  const baseHandlers = useEditorHandlers({
    form,
    modals,
    mutations,
    editModal: modals.editModal,
    deleteModal: modals.deleteModal,
    selectedBlog,
    setSelectedBlog,
  });

  const handlers = useMemo(
    () => ({
      ...baseHandlers,
      handleNewBlog, // Use our local version
    }),
    [baseHandlers, handleNewBlog],
  );

  // Query param blog loader
  const { isLoadingBlog, blogSlug } = useQueryParamBlog({
    onBlogFound: useCallback(
      (blog: PostArticleRo) => {
        if (!selectedBlog) handlers.handleEditBlog(blog);
      },
      [handlers, selectedBlog],
    ),
    skipLoading:
      uiState.showPreview ||
      modals.isTrashingBlog ||
      !!selectedBlog ||
      queries.viewMode === "trash",
  });

  // Sorting and filtering
  const filteredAndSortedBlogs = useFilteredAndSortedBlogs(
    queries.activePosts,
    uiState.sortOptions,
  );

  const showEditorSkeleton =
    isLoadingBlog && !!blogSlug && !modals.isTrashingBlog;

  const previewTitle = modals.editModal.visible
    ? modals.editModal.entity.title
    : "Preview Title";
  const previewCreationDate = modals.editModal.visible
    ? modals.editModal.entity.firstModDate.toISOString()
    : new Date().toISOString();

  return {
    ui: {
      sortOptions: uiState.sortOptions,
      setSortOptions: uiState.setSortOptions,
      viewMode: queries.viewMode,
      isTrashingBlog: modals.isTrashingBlog,
    },
    data: {
      activePosts: queries.activePosts,
      trashedPosts: queries.trashedPosts,
      filteredAndSortedBlogs,
      postsQuery: queries.postsQuery,
      trashedQuery: queries.trashedQuery,
      isLoadingBlog,
      blogSlug,
      showEditorSkeleton,
    },
    editor: {
      form: form.form,
      previewTitle,
      previewCreationDate,
    },
    preview: {
      showPreview: uiState.showPreview,
      togglePreview: uiState.togglePreview,
    },
    trash: {
      trashedQuery: queries.trashedQuery,
    },
    modals: {
      editModal: modals.editModal,
      deleteModal: modals.deleteModal,
    },
    mutations: {
      createMutation: mutations.createMutation,
      updateMutation: mutations.updateMutation,
      trashPost: mutations.trashPost,
      isSubmitting: mutations.isSubmitting,
    },
    handlers: {
      handleNewBlog: handlers.handleNewBlog,
      handleEditBlog: handlers.handleEditBlog,
      handleDeleteBlog: handlers.handleDeleteBlog,
      confirmDelete: handlers.confirmDelete,
      cancelDelete: handlers.cancelDelete,
      restoreMutation: mutations.restoreMutation,
      purgeMutation: mutations.purgeMutation,
      onSubmit: handlers.onSubmit,
    },
  };
}
