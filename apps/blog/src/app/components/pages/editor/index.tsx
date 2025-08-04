"use client";

import type { SubmitHandler } from "react-hook-form";
import type { Optional } from "ts-roids";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import type { EntityViewState } from "@ashgw/ui";
import { logger } from "@ashgw/observability";
import { Skeleton } from "@ashgw/ui";

import type { SortOptions as SortOptionsType } from "./components/header/SortOptions";
import type { PostDetailRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";
import { trpcClientSide } from "~/trpc/client";
import { SoundProvider } from "../../misc/SoundContext";
import { SoundToggle } from "../../misc/SoundToggle";
import { BlogList } from "./components/blog-list";
import { ConfirmBlogDeleteModal } from "./components/ConfirmBlogDeleteModal";
import { PostEditorForm } from "./components/editor-form";
import { Header } from "./components/header";
import { BlogPreview } from "./components/preview";
import { useFilteredAndSortedBlogs } from "./hooks/useFilteredAndSortedBlogs";
import { useQueryParamBlog } from "./hooks/useQueryParamBlog";

export function EditorPage() {
  const [editModal, setEditModal] = useState<EntityViewState<PostDetailRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<EntityViewState<PostDetailRo>>(
    {
      visible: false,
    },
  );

  const [showPreview, setShowPreview] = useState(false);
  const [isDeletingBlog, setIsDeletingBlog] = useState(false);
  const [selectedBlog, setSelectedBlog] =
    useState<Optional<PostDetailRo>>(null);

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
      mdxContent: "",
    },
  });

  const utils = trpcClientSide.useUtils();
  const postsQuery = trpcClientSide.post.getAllPosts.useQuery();

  // Edit blog: load values into form
  const handleEditBlog = useCallback(
    (blog: PostDetailRo) => {
      // Don't load blog content if we're in the process of deleting
      if (isDeletingBlog) return;

      setSelectedBlog(blog);
      setEditModal({ visible: true, entity: blog });
      form.reset({
        title: blog.title,
        summary: blog.summary,
        category: blog.category,
        tags: blog.tags,
        isReleased: blog.isReleased,
        mdxContent: blog.fontMatterMdxContent.body,
      });
      logger.info("Editing blog", { slug: blog.slug });
    },
    [form, isDeletingBlog],
  );

  const { isLoadingBlog, blogSlug } = useQueryParamBlog({
    onBlogFound: useCallback(
      (blog: PostDetailRo) => {
        // Only load from URL if no blog is currently selected
        if (!selectedBlog) {
          handleEditBlog(blog);
        }
      },
      [handleEditBlog, selectedBlog],
    ),
    skipLoading: showPreview || isDeletingBlog || !!selectedBlog, // Skip loading if preview mode, deleting, or blog already selected
  });

  const filteredAndSortedBlogs = useFilteredAndSortedBlogs(
    postsQuery.data,
    sortOptions,
  );

  const createMutation = trpcClientSide.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      void utils.post.getAllPosts.invalidate();
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
      void utils.post.getAllPosts.invalidate();
      handleNewBlog();
    },
    onError: (error) => {
      logger.error("Failed to update post", { error });
      toast.error("Failed to update post", {
        description: error.message,
      });
    },
  });

  const deleteMutation = trpcClientSide.post.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
      void utils.post.getAllPosts.invalidate();
      setDeleteModal({ visible: false });
      setIsDeletingBlog(false);

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
      setIsDeletingBlog(false);
    },
  });

  // Add new blog: clear form
  function handleNewBlog() {
    setSelectedBlog(null);
    setEditModal({ visible: false });
    form.reset({
      title: "",
      summary: "",
      category: PostCategoryEnum.SOFTWARE,
      tags: [],
      isReleased: false,
      mdxContent: "",
    });
  }

  function handleDeleteBlog(blog: PostDetailRo) {
    setIsDeletingBlog(true);
    setDeleteModal({ visible: true, entity: blog });
  }

  function confirmDelete() {
    if (deleteModal.visible) {
      deleteMutation.mutate({ slug: deleteModal.entity.slug });
      if (selectedBlog?.slug === deleteModal.entity.slug) {
        setSelectedBlog(null);
      }
    }
  }

  function cancelDelete() {
    setDeleteModal({ visible: false });
    setIsDeletingBlog(false);
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
  const showEditorSkeleton = isLoadingBlog && !!blogSlug && !isDeletingBlog;
  const formValues = form.watch();

  return (
    <SoundProvider>
      <div className="container mx-auto p-8">
        <Header
          onClick={handleNewBlog}
          sortOptions={sortOptions}
          onSortOptionsChange={setSortOptions}
          blogs={postsQuery.data ?? []}
          isPreviewEnabled={showPreview}
          onTogglePreview={togglePreview}
        />
        <div
          className={`grid grid-cols-1 gap-8 lg:grid-cols-3 ${deleteModal.visible ? "pointer-events-none" : ""}`}
        >
          <BlogList
            blogs={filteredAndSortedBlogs}
            onEdit={handleEditBlog}
            onDelete={handleDeleteBlog}
            isLoading={
              postsQuery.isLoading || (isLoadingBlog && !isDeletingBlog)
            }
          />
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
                    formData={formValues}
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
        {deleteModal.visible ? (
          <ConfirmBlogDeleteModal
            blog={deleteModal.entity}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            isDeleting={deleteMutation.isPending}
          />
        ) : null}
        <SoundToggle />
        <Toaster position="bottom-right" />
      </div>
    </SoundProvider>
  );
}

export default EditorPage;
