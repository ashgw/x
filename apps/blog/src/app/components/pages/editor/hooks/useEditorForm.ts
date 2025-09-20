"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PostArticleRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";

export function useEditorForm() {
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

  const resetForm = () => {
    form.reset({
      title: "",
      summary: "",
      category: PostCategoryEnum.SOFTWARE,
      tags: [],
      isReleased: false,
      mdxText: "",
    });
  };

  const loadBlogIntoForm = (blog: PostArticleRo) => {
    form.reset({
      title: blog.title,
      summary: blog.summary,
      category: blog.category,
      tags: blog.tags,
      isReleased: blog.isReleased,
      mdxText: blog.fontMatterMdxContent.body,
    });
  };

  return {
    form,
    resetForm,
    loadBlogIntoForm,
  };
}
