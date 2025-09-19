"use client";
// TODO: this file is bloated as a bich, refactor into smaller components & make it make sense
import type { SubmitHandler } from "react-hook-form";
import type { Optional } from "ts-roids";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { observer } from "mobx-react-lite";

import type { EntityViewState } from "@ashgw/ui";
import { logger } from "@ashgw/logger";
import { Skeleton } from "@ashgw/ui";

import { Header } from "./components/header";
import type { SortOptions as SortOptionsType } from "./components/header/components/SortOptions";
import type { PostArticleRo, PostEditorDto } from "~/api/models/post";
import { trpcClientSide } from "~/trpc/callers/client";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";
import { useStore } from "~/app/stores";
import { TrashList } from "./components/lists/ItemList";
import { BlogList, ConfirmBlogDeleteModal } from "./components/blog-list";
import { BlogPreview } from "./components/preview";
import { PostEditorForm } from "./components/editor-form";
import { SoundProvider, SoundToggle } from "./components/sound";
import { useFilteredAndSortedBlogs } from "./hooks/useFilteredAndSortedBlogs";
import { useQueryParamBlog } from "./hooks/useQueryParamBlog";

export const EditorPage = observer(() => {
  const [editModal, setEditModal] = useState<EntityViewState<PostArticleRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<
    EntityViewState<PostArticleRo>
  >({
    visible: false,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isTrashingBlog, setIsTrashingBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] =
    useState<Optional<PostArticleRo>>(null);

  const { store } = useStore();

  // Prevent scrolling when modal is open
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

  const [sortOptions, setSortOptions] = useState<SortOptionsType>({
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

  const utils = trpcClientSide.useUtils();

  const postsQuery = trpcClientSide.post.getAllAdminPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "active",
  });

  const trashedQuery = trpcClientSide.post.getTrashedPosts.useQuery(undefined, {
    enabled: store.editor.viewMode === "trash",
  });

  // Update store when data changes
  useEffect(() => {
    if (postsQuery.data) {
      store.editor.setActivePosts(postsQuery.data);
    }
  }, [postsQuery.data, store.editor]);

  useEffect(() => {
    if (trashedQuery.data) {
      store.editor.setTrashedPosts(trashedQuery.data);
    }
  }, [trashedQuery.data, store.editor]);

  // Edit blog: load values into form
  const handleEditBlog = useCallback(
    (blog: PostArticleRo) => {
      // Don't load blog content if we're in the process of deleting
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

  const { isLoadingBlog, blogSlug } = useQueryParamBlog({
    onBlogFound: useCallback(
      (blog: PostArticleRo) => {
        // Only load from URL if no blog is currently selected
        if (!selectedBlog) {
          handleEditBlog(blog);
        }
      },
      [handleEditBlog, selectedBlog],
    ),
    skipLoading:
      showPreview ||
      isTrashingBlog ||
      !!selectedBlog ||
      store.editor.viewMode === "trash", // Skip loading if preview mode, deleting, or blog already selected
  });

  const filteredAndSortedBlogs = useFilteredAndSortedBlogs(
    store.editor.activePosts,
    sortOptions,
  );

  const createMutation = trpcClientSide.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      void utils.post.getAllAdminPosts.invalidate();
      handleNewBlog();
    },
    onError: (error) => {
      logger.error("Failed to create post", { error });
      toast.error("Failed to create post", {
        description: error.message,
      });
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
      toast.error("Failed to update post", {
        description: error.message,
      });
    },
  });

  //  soft delete
  const trashPost = trpcClientSide.post.trashPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      // Update store immediately - remove from active posts
      if (deleteModal.visible) {
        store.editor.movePostToTrash(deleteModal.entity.slug);
      }
      void utils.post.getAllAdminPosts.invalidate();
      void utils.post.getTrashedPosts.invalidate();
      setDeleteModal({ visible: false });
      setIsTrashingBlog(false);

      // If editing the deleted blog, reset form
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
      toast.error("Failed to delete post", {
        description: error.message,
      });
      setIsTrashingBlog(false);
    },
  });

  const restoreMutation = trpcClientSide.post.restoreFromTrash.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Post restored successfully");
      // Update store immediately - remove from trash
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
      // Update store immediately - remove from trash
      store.editor.purgePostFromTrash(variables.trashId);
      void utils.post.getTrashedPosts.invalidate();
    },
    onError: (error) => {
      logger.error("Failed to purge post", { error });
      toast.error("Failed to purge post", { description: error.message });
    },
  });

  function handleNewBlog() {
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
    // Clear URL query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("blog");
    window.history.replaceState({}, "", url.toString());
  }

  function handleDeleteBlog(blog: PostArticleRo) {
    setIsTrashingBlog(true);
    setDeleteModal({ visible: true, entity: blog });
  }

  function confirmDelete() {
    if (deleteModal.visible) {
      trashPost.mutate({ slug: deleteModal.entity.slug });
    }
  }

  // TODO: remove this function and just use onClose directly in modal
  function cancelDelete() {
    setDeleteModal({ visible: false });
    setIsTrashingBlog(false);
  }

  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  const onSubmit: SubmitHandler<PostEditorDto> = (data) => {
    if (editModal.visible) {
      updateMutation.mutate({
        slug: editModal.entity.slug,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  // Show editor loading state only when we're expecting to load a blog from URL
  const showEditorSkeleton = isLoadingBlog && !!blogSlug && !isTrashingBlog;

  return (
    <SoundProvider>
      <div className="container mx-auto p-8">
        <Header
          onClick={handleNewBlog}
          sortOptions={sortOptions}
          onSortOptionsChange={setSortOptions}
          blogs={store.editor.activePosts}
          isPreviewEnabled={showPreview}
          onTogglePreview={togglePreview}
        />
        {store.editor.viewMode === "active" ? (
          <div
            className={`grid grid-cols-1 gap-8 lg:grid-cols-3 ${deleteModal.visible ? "pointer-events-none" : ""}`}
          >
            {postsQuery.error?.message ? (
              <BlogList
                errorMessage={postsQuery.error.message}
                blogs={filteredAndSortedBlogs}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
                isLoading={isLoadingBlog && !isTrashingBlog}
              />
            ) : (
              <BlogList
                blogs={filteredAndSortedBlogs}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
                isLoading={
                  postsQuery.isLoading || (isLoadingBlog && !isTrashingBlog)
                }
              />
            )}
            {showEditorSkeleton ? (
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border p-4">
                  <Skeleton className="w-full" />
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait" initial={false}>
                  <PostEditorForm
                    key="editor"
                    form={form}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    isHidden={showPreview}
                  />
                  {showPreview ? (
                    <BlogPreview
                      key="preview"
                      isVisible={showPreview}
                      form={form}
                      title={
                        editModal.visible
                          ? editModal.entity.title
                          : "Preview Title"
                      }
                      creationDate={
                        editModal.visible
                          ? editModal.entity.firstModDate.toISOString()
                          : new Date().toISOString()
                      }
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <TrashList
              items={store.editor.trashedPosts}
              onRestore={(item) => restoreMutation.mutate({ trashId: item.id })}
              onPurge={(item) => purgeMutation.mutate({ trashId: item.id })}
              isLoading={trashedQuery.isLoading}
            />
            <div className="lg:col-span-2">
              <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border p-4">
                Select an item to restore or purge.
              </div>
            </div>
          </div>
        )}
        {deleteModal.visible ? (
          <ConfirmBlogDeleteModal
            blog={deleteModal.entity}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isDeleting={trashPost.isPending}
          />
        ) : null}
        <SoundToggle />
        <Toaster position="bottom-right" />
      </div>
    </SoundProvider>
  );
});

export default EditorPage;
