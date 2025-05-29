"use client";

import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { ModalState } from "@ashgw/ui";
import { logger } from "@ashgw/observability";

import type { PostDetailRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";
import { BlogList } from "./components/BlogList";
import { ConfirmBlogDeleteModal } from "./components/ConfirmBlogDeleteModal";
import { PostEditorForm } from "./components/Form";
import { Header } from "./components/Header";

const dummyBlogs: PostDetailRo[] = [
  {
    title: "Cholesterol",
    seoTitle: "How bad science hijacked medicine and destroyed public health",
    summary: "How bad science hijacked medicine and destroyed public health",
    firstModDate: new Date("2025-02-07T09:15:00-0401"),
    lastModDate: new Date("2025-02-07T09:15:00-0401"),
    isReleased: true,
    minutesToRead: 17,
    tags: ["cholesterol", "statins", "fat"],
    category: PostCategoryEnum.HEALTH,
    slug: "cholesterol",
    fontMatterMdxContent: {
      body: "I recently visited the doctor...", // truncated for brevity
      bodyBegin: 0,
    },
  },
  {
    title: "Code or Capital",
    seoTitle: "There's hobbyist code and there's business code.",
    summary: "There's hobbyist code and there's business code.",
    firstModDate: new Date("2023-12-14T19:45:00-0401"),
    lastModDate: new Date("2023-12-14T19:45:00-0401"),
    isReleased: true,
    minutesToRead: 3,
    tags: ["code", "capital", "quality"],
    category: PostCategoryEnum.SOFTWARE,
    slug: "code-or-capital",
    fontMatterMdxContent: {
      body: "There are two distinct modes...", // truncated for brevity
      bodyBegin: 0,
    },
  },
];

export function EditorPage() {
  const [editModal, setEditModal] = useState<ModalState<PostDetailRo>>({
    visible: false,
  });

  const [deleteModal, setDeleteModal] = useState<ModalState<PostDetailRo>>({
    visible: false,
  });

  const [blogs, setBlogs] = useState<PostDetailRo[]>(dummyBlogs);

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

  const content = form.watch("mdxContent");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length || 0;
  const minutesToRead =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

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
    logger.info("Editing blog:", blog);
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

  // Confirm delete: remove from list
  function confirmDelete() {
    if (deleteModal.visible) {
      setBlogs((prev) =>
        prev.filter((b) => b.slug !== deleteModal.entity.slug),
      );
      logger.info("Deleted blog:", deleteModal.entity);

      // If editing the deleted blog, reset form
      if (
        editModal.visible &&
        editModal.entity.slug === deleteModal.entity.slug
      ) {
        handleNewBlog();
      }
    }
    setDeleteModal({ visible: false });
  }

  function cancelDelete() {
    setDeleteModal({ visible: false });
  }

  const onSubmit: SubmitHandler<PostEditorDto> = async (data, _err) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (editModal.visible) {
        setBlogs((prev) =>
          prev.map((b) =>
            b.slug === editModal.entity.slug
              ? {
                  ...b,
                  ...data,
                  lastModDate: new Date(),
                  fontMatterMdxContent: {
                    ...b.fontMatterMdxContent,
                    body: data.mdxContent,
                    bodyBegin: 0,
                  },
                }
              : b,
          ),
        );
      } else {
        setBlogs((prev) => [
          {
            ...data,
            slug: data.title.toLowerCase().replace(/\s+/g, "-"),
            seoTitle: data.title,
            firstModDate: new Date(),
            lastModDate: new Date(),
            minutesToRead,
            fontMatterMdxContent: { body: data.mdxContent, bodyBegin: 0 },
          },
          ...prev,
        ]);
      }

      handleNewBlog();
    } catch (error) {
      logger.error("Failed to save blog post", { error });
      // TODO: Add toast notification for error
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Header onClick={handleNewBlog} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <BlogList
          blogs={blogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
        />
        <PostEditorForm form={form} onSubmit={onSubmit} />
      </div>
      {deleteModal.visible ? (
        <ConfirmBlogDeleteModal
          blog={deleteModal.entity}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      ) : null}
    </div>
  );
}

export default EditorPage;
