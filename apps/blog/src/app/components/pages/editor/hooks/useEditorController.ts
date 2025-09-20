"use client";

import type { SortOptions } from "../components/header/components/SortOptions";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import type { Optional } from "ts-roids";

import { useStore } from "~/app/stores";
import { trpcClientSide } from "~/trpc/callers/client";
import { logger } from "@ashgw/logger";
import type { EntityViewState } from "@ashgw/ui";
import type { PostArticleRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";

import { useFilteredAndSortedBlogs } from "../hooks/useFilteredAndSortedBlogs";
import { useQueryParamBlog } from "../hooks/useQueryParamBlog";

export type UseEditorControllerReturn = ReturnType<typeof useEditorController>;

export function useEditorController() {
  const { store } = useStore();

  const [editModal, setEditModal] = useState<EntityViewState<PostArticleRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<
    EntityViewState<PostArticleRo>
  >({ visible: false });

  const [showPreview, setShowPreview] = useState(false);
  const [isTrashingBlog, setIsTrashingBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] =
    useState<Optional<PostArticleRo>>(null);

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortField: "lastModDate",
    sortOrder: "desc",
    statusFilter: "all",
    categoryFilter: "all",
    tagFilter: null,
  });

  const form = useForm<PostEditorDto>({
    resolver: zodResolver(postEditorSchemaDto),
    mode: "onChange",
    defaultValues: {
      title: "",
      summary: "",
      category: PostCategoryEnum.SOFTWARE,
      tags: [],
      isReleased: false,
      mdxText: "",
    },
  });

  // === Queries
  const postsQuery = trpcClientSide.post.getAllAdminPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "active",
  });

  const trashedQuery = trpcClientSide.post.getTrashedPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "trash",
  });

  // === Keep MobX store in sync
  useEffect(() => {
    if (postsQuery.data) store.editor.setActivePosts(postsQuery.data);
  }, [postsQuery.data, store.editor]);

  useEffect(() => {
    if (trashedQuery.data) store.editor.setTrashedPosts(trashedQuery.data);
  }, [trashedQuery.data, store.editor]);

  // New blog
  const handleNewBlog = useCallback(() => {
    setSelectedBlog(null);
    setEditModal({ visible: false });
    form.reset({
      title: "",
      summary: "",
      category: PostCategoryEnum.SOFTWARE,
      tags: [],
      isReleased: false,
      mdxText: "",
    });
    const url = new URL(window.location.href);
    url.searchParams.delete("blog");
    window.history.replaceState({}, "", url.toString());
  }, [form]);

  // Edit blog
  const handleEditBlog = useCallback(
    (blog: PostArticleRo) => {
      if (isTrashingBlog) return;
      setSelectedBlog(blog);
      setEditModal({ visible: true, entity: blog });
      form.reset({
        title: blog.title,
        summary: blog.summary,
        category: blog.category,
        tags: blog.tags,
        isReleased: blog.isReleased,
        mdxText: blog.fontMatterMdxContent.body,
      });
      logger.info("Editing blog", { slug: blog.slug });
    },
    [form, isTrashingBlog],
  );

  // Query param blog loader
  const { isLoadingBlog, blogSlug } = useQueryParamBlog({
    onBlogFound: useCallback(
      (blog: PostArticleRo) => {
        if (!selectedBlog) handleEditBlog(blog);
      },
      [handleEditBlog, selectedBlog],
    ),
    skipLoading:
      showPreview ||
      isTrashingBlog ||
      !!selectedBlog ||
      store.editor.viewMode === "trash",
  });

  // Sorting and filtering
  const filteredAndSortedBlogs = useFilteredAndSortedBlogs(
    store.editor.activePosts,
    sortOptions,
  );

  // Mutations
  const utils = trpcClientSide.useUtils();

  const createMutation = trpcClientSide.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      void utils.post.getAllAdminPosts.invalidate();
      handleNewBlog();
    },
    onError: (error) => {
      logger.error("Failed to create post", { error });
      toast.error("Failed to create post", { description: error.message });
    },
  });

  const updateMutation = trpcClientSide.post.updatePost.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      void utils.post.getAllAdminPosts.invalidate();
      handleNewBlog();
    },
    onError: (error) => {
      logger.error("Failed to update post", { error });
      toast.error("Failed to update post", { description: error.message });
    },
  });

  const trashPost = trpcClientSide.post.trashPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      if (deleteModal.visible) {
        store.editor.movePostToTrash(deleteModal.entity.slug);
      }
      void utils.post.getAllAdminPosts.invalidate();
      void utils.post.getTrashedPosts.invalidate();
      setDeleteModal({ visible: false });
      setIsTrashingBlog(false);

      if (
        editModal.visible &&
        deleteModal.visible &&
        editModal.entity.slug === deleteModal.entity.slug
      ) {
        handleNewBlog();
      }
    },
    onError: (error) => {
      logger.error("Failed to delete post", { error });
      toast.error("Failed to delete post", { description: error.message });
      setIsTrashingBlog(false);
    },
  });

  const restoreMutation = trpcClientSide.post.restoreFromTrash.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Post restored successfully");
      store.editor.restorePostFromTrash(variables.trashId);
      void utils.post.getTrashedPosts.invalidate();
      void utils.post.getAllAdminPosts.invalidate();
    },
    onError: (error) => {
      logger.error("Failed to restore post", { error });
      toast.error("Failed to restore post", { description: error.message });
    },
  });

  const purgeMutation = trpcClientSide.post.purgeTrash.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Post permanently deleted");
      store.editor.purgePostFromTrash(variables.trashId);
      void utils.post.getTrashedPosts.invalidate();
    },
    onError: (error) => {
      logger.error("Failed to purge post", { error });
      toast.error("Failed to purge post", { description: error.message });
    },
  });

  // Delete flow
  const handleDeleteBlog = useCallback((blog: PostArticleRo) => {
    setIsTrashingBlog(true);
    setDeleteModal({ visible: true, entity: blog });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteModal.visible) {
      trashPost.mutate({ slug: deleteModal.entity.slug });
    }
  }, [trashPost]);

  const cancelDelete = useCallback(() => {
    setDeleteModal({ visible: false });
    setIsTrashingBlog(false);
  }, []);

  // Submit
  const onSubmit: SubmitHandler<PostEditorDto> = (data) => {
    if (editModal.visible) {
      updateMutation.mutate({ slug: editModal.entity.slug, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // UI helpers
  const togglePreview = useCallback(() => setShowPreview((p) => !p), []);

  // Effects for body scroll lock during delete modal
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

  const showEditorSkeleton = isLoadingBlog && !!blogSlug && !isTrashingBlog;

  const previewTitle = editModal.visible
    ? editModal.entity.title
    : "Preview Title";
  const previewCreationDate = editModal.visible
    ? editModal.entity.firstModDate.toISOString()
    : new Date().toISOString();

  return {
    ui: {
      sortOptions,
      setSortOptions,
      viewMode: store.editor.viewMode,
      isTrashingBlog,
    },
    data: {
      activePosts: store.editor.activePosts,
      trashedPosts: store.editor.trashedPosts,
      filteredAndSortedBlogs,
      postsQuery,
      trashedQuery,
      isLoadingBlog,
      blogSlug,
      showEditorSkeleton,
    },
    editor: {
      form,
      previewTitle,
      previewCreationDate,
    },
    preview: {
      showPreview,
      togglePreview,
    },
    trash: {
      trashedQuery,
    },
    modals: {
      editModal,
      deleteModal,
    },
    mutations: {
      createMutation,
      updateMutation,
      trashPost,
      isSubmitting: createMutation.isPending || updateMutation.isPending,
    },
    handlers: {
      handleNewBlog,
      handleEditBlog,
      handleDeleteBlog,
      confirmDelete,
      cancelDelete,
      restoreMutation,
      purgeMutation,
      onSubmit,
    },
  };
}
