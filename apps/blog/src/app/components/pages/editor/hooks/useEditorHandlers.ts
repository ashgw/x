"use client";

import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";

import type { Optional } from "ts-roids";

import { logger } from "@ashgw/logger";
import type { EntityViewState } from "@ashgw/ui";
import type { PostArticleRo, PostEditorDto } from "~/api/models/post";
// no store access here; store updates handled in mutations hook

import type { useEditorForm } from "./useEditorForm";
import type { useEditorModals } from "./useEditorModals";
import type { useEditorMutations } from "./useEditorMutations";

interface UseEditorHandlersParams {
  form: ReturnType<typeof useEditorForm>;
  modals: ReturnType<typeof useEditorModals>;
  mutations: ReturnType<typeof useEditorMutations>;
  editModal: EntityViewState<PostArticleRo>;
  deleteModal: EntityViewState<PostArticleRo>;
  selectedBlog: Optional<PostArticleRo>;
  setSelectedBlog: (blog: Optional<PostArticleRo>) => void;
}

export function useEditorHandlers({
  form,
  modals,
  mutations,
  editModal,
  deleteModal,
  selectedBlog: _selectedBlog,
  setSelectedBlog,
}: UseEditorHandlersParams) {
  const handleNewBlog = useCallback(() => {
    setSelectedBlog(null);
    modals.closeEditModal();
    form.resetForm();
    const url = new URL(window.location.href);
    url.searchParams.delete("blog");
    window.history.replaceState({}, "", url.toString());
  }, [form, modals, setSelectedBlog]);

  const handleEditBlog = useCallback(
    (blog: PostArticleRo) => {
      if (modals.isTrashingBlog) return;
      setSelectedBlog(blog);
      modals.openEditModal(blog);
      form.loadBlogIntoForm(blog);
      logger.info("Editing blog", { slug: blog.slug });
    },
    [form, modals, setSelectedBlog],
  );

  const handleDeleteBlog = useCallback(
    (blog: PostArticleRo) => {
      modals.openDeleteModal(blog);
    },
    [modals],
  );

  const confirmDelete = useCallback(() => {
    if (deleteModal.visible) {
      mutations.trashPost.mutate({ slug: deleteModal.entity.slug });
    }
  }, [deleteModal, mutations]);

  const cancelDelete = useCallback(() => {
    modals.closeDeleteModal();
  }, [modals]);

  const onSubmit: SubmitHandler<PostEditorDto> = useCallback(
    (data) => {
      if (editModal.visible) {
        mutations.updateMutation.mutate({ slug: editModal.entity.slug, data });
      } else {
        mutations.createMutation.mutate(data);
      }
    },
    [editModal, mutations],
  );

  const handleRestore = useCallback(
    (item: { id: string }) => {
      mutations.restoreMutation.mutate({ trashId: item.id });
    },
    [mutations],
  );

  const handlePurge = useCallback(
    (item: { id: string }) => {
      mutations.purgeMutation.mutate({ trashId: item.id });
    },
    [mutations],
  );

  return {
    handleNewBlog,
    handleEditBlog,
    handleDeleteBlog,
    confirmDelete,
    cancelDelete,
    onSubmit,
    handleRestore,
    handlePurge,
  };
}
