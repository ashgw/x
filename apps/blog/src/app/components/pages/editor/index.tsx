"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";

import type { ModalState } from "@ashgw/ui";
import { logger } from "@ashgw/observability";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@ashgw/ui";

import type { PostDetailRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum, postEditorSchemaDto } from "~/api/models/post";
import { BlogList } from "./components/BlogList";
import { ConfirmBlogDeleteModal } from "./components/ConfirmBlogDeleteModal";
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
  const [tagInput, setTagInput] = useState("");

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

  // Watch for content to calculate word count
  const content = form.watch("mdxContent");
  const tags = form.watch("tags");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length || 0;
  const minutesToRead =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  // Add tag
  function handleAddTag() {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      form.setValue("tags", [...tags, newTag]);
    }
    setTagInput("");
  }
  // Remove tag
  function handleRemoveTag(tag: string) {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  }

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

  async function onSubmit(data: PostEditorDto) {
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
  }

  return (
    <div className="container mx-auto p-8">
      <Header onClick={handleNewBlog} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <BlogList
          blogs={blogs}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
        />
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Editor</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Blog Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Summary (1-2 sentences)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                            >
                              {field.value.charAt(0) +
                                field.value.slice(1).toLowerCase()}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <DropdownMenuLabel>
                              Select a category
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(PostCategoryEnum).map((cat) => (
                              <DropdownMenuItem
                                key={cat}
                                onClick={() => field.onChange(cat)}
                              >
                                <div className="flex items-center gap-2">
                                  {cat === field.value && (
                                    <Check className="h-4 w-4" />
                                  )}
                                  <span>
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                  </span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {field.value.map((tag) => (
                              <span
                                key={tag}
                                className="bg-muted mb-1 mr-1 inline-flex items-center rounded px-2 py-1 text-xs"
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="ml-1 text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="flex-1 rounded-md border p-2"
                              placeholder="Add tag"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              onClick={handleAddTag}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...form.register("isReleased")} />
                    <span>Released</span>
                  </label>
                  <span className="text-muted-foreground text-sm">
                    {`${minutesToRead} min read`} ({wordCount} words)
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="mdxContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog content in MDX..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="squared:outline"
                    type="button"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="squared:default"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
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
