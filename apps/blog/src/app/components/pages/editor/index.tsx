"use client";

import type { SubmitHandler } from "react-hook-form";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

import type { EntityViewState } from "@ashgw/ui";
import { logger } from "@ashgw/observability";

import type { SortOptions as SortOptionsType } from "./components/SortOptions";
import type { PostDetailRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";
import { trpcClientSide } from "~/trpc/client";
import { BlogList } from "./components/BlogList";
import { ConfirmBlogDeleteModal } from "./components/ConfirmBlogDeleteModal";
import { PostEditorForm } from "./components/Form";
import { Header } from "./components/Header";

export function EditorPage() {
  const [editModal, setEditModal] = useState<EntityViewState<PostDetailRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<EntityViewState<PostDetailRo>>(
    {
      visible: false,
    },
  );

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

  const filteredAndSortedBlogs = useMemo(() => {
    if (!postsQuery.data) return [];

    // Apply filtering
    let filtered = [...postsQuery.data];

    // Status filter
    if (sortOptions.statusFilter !== "all") {
      const isReleased = sortOptions.statusFilter === "released";
      filtered = filtered.filter((blog) => blog.isReleased === isReleased);
    }

    // Category filter
    if (sortOptions.categoryFilter !== "all") {
      filtered = filtered.filter(
        (blog) => blog.category === sortOptions.categoryFilter,
      );
    }

    // Tag filter
    if (sortOptions.tagFilter !== null) {
      const tagToFilter = sortOptions.tagFilter;
      filtered = filtered.filter((blog) => blog.tags.includes(tagToFilter));
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortOptions.sortField];
      const bValue = b[sortOptions.sortField];

      // Handle dates for proper comparison
      if (
        sortOptions.sortField === "lastModDate" ||
        sortOptions.sortField === "firstModDate"
      ) {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortOptions.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      // For string values like title
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOptions.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [postsQuery.data, sortOptions]);

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
    },
  });

  // Edit blog: load values into form
  function handleEditBlog(blog: PostDetailRo) {
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
  }

  // Add new blog: clear form
  function handleNewBlog() {
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

  // Delete blog: open modal
  function handleDeleteBlog(blog: PostDetailRo) {
    setDeleteModal({ visible: true, entity: blog });
  }

  // Confirm delete: call delete mutation
  function confirmDelete() {
    if (deleteModal.visible) {
      deleteMutation.mutate({ slug: deleteModal.entity.slug });
    }
  }

  function cancelDelete() {
    setDeleteModal({ visible: false });
  }

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

  return (
    <div className="container mx-auto p-8">
      <Header
        onClick={handleNewBlog}
        sortOptions={sortOptions}
        onSortOptionsChange={setSortOptions}
        blogs={postsQuery.data ?? []}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <BlogList
          blogs={filteredAndSortedBlogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          isLoading={postsQuery.isLoading}
        />
        <PostEditorForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
      {deleteModal.visible && (
        <ConfirmBlogDeleteModal
          blog={deleteModal.entity}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default EditorPage;
