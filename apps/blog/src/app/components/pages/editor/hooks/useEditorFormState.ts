"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PostArticleRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";

const DEFAULT_VALUES: PostEditorDto = {
  title: "",
  summary: "",
  category: PostCategoryEnum.SOFTWARE,
  tags: [],
  isReleased: false,
  mdxText: "",
};

export function useEditorFormState() {
  const form = useForm<PostEditorDto>({
    resolver: zodResolver(postEditorSchemaDto),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const resetToEmpty = () => {
    form.reset(DEFAULT_VALUES);
  };

  const loadFromBlog = (blog: PostArticleRo) => {
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
    resetToEmpty,
    loadFromBlog,
  };
}

