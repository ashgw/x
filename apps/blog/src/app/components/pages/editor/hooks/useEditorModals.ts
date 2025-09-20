"use client";

import { useState, useEffect } from "react";

import type { EntityViewState } from "@ashgw/ui";
import type { PostArticleRo } from "~/api/models/post";

export function useEditorModals() {
  const [editModal, setEditModal] = useState<EntityViewState<PostArticleRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<
    EntityViewState<PostArticleRo>
  >({ visible: false });

  const [isTrashingBlog, setIsTrashingBlog] = useState(false);

  // Body scroll lock during delete modal
  useEffect(() => {
    if (deleteModal.visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [deleteModal.visible]);

  const openEditModal = (blog: PostArticleRo) => {
    setEditModal({ visible: true, entity: blog });
  };

  const closeEditModal = () => {
    setEditModal({ visible: false });
  };

  const openDeleteModal = (blog: PostArticleRo) => {
    setIsTrashingBlog(true);
    setDeleteModal({ visible: true, entity: blog });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ visible: false });
    setIsTrashingBlog(false);
  };

  return {
    editModal,
    deleteModal,
    isTrashingBlog,
    setIsTrashingBlog,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  };
}
