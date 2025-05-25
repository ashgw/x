"use client";

import { useState } from "react";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { logger } from "@ashgw/observability";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ashgw/ui";

import type { PostDetailRo, PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum } from "~/api/models/post";

type Blog = PostDetailRo;

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
  const [blogs, setBlogs] = useState<Blog[]>(dummyBlogs);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Tag input state (for adding tags)
  const [tagInput, setTagInput] = useState("");

  // React Hook Form
  const { register, handleSubmit, setValue, reset, control, watch } =
    useForm<PostEditorDto>({
      defaultValues: {
        title: "",
        summary: "",
        category: PostCategoryEnum.SOFTWARE,
        tags: [],
        isReleased: false,
        mdxContent:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    });

  // Watch for content to calculate word count
  const content = watch("mdxContent");
  const tags = watch("tags");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length || 0;
  const minutesToRead =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  // Add tag
  function handleAddTag() {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setValue("tags", [...tags, newTag]);
    }
    setTagInput("");
  }
  // Remove tag
  function handleRemoveTag(tag: string) {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  }

  // Edit blog: load values into form
  function handleEditBlog(blog: Blog) {
    setEditingBlog(blog);
    reset({
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
    setEditingBlog(null);
    reset({
      title: "",
      summary: "",
      category: PostCategoryEnum.SOFTWARE,
      tags: [],
      isReleased: false,
      mdxContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    });
  }

  // Delete blog: open modal
  function handleDeleteBlog(blog: Blog) {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  }

  // Confirm delete: remove from list
  function confirmDelete() {
    if (blogToDelete) {
      setBlogs((prev) => prev.filter((b) => b.slug !== blogToDelete.slug));
      logger.info("Deleted blog:", blogToDelete);
    }
    setShowDeleteModal(false);
    setBlogToDelete(null);
    // If editing the deleted blog, reset form
    if (editingBlog && blogToDelete && editingBlog.slug === blogToDelete.slug) {
      handleNewBlog();
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  }

  // On submit: log data (simulate save)
  function onSubmit(data: PostEditorDto) {
    logger.info("Form submitted:", data);
    // If editing, update; else, add new
    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.slug === editingBlog.slug
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
          firstModDate: new Date(),
          lastModDate: new Date(),
          minutesToRead,
          fontMatterMdxContent: { body: data.mdxContent, bodyBegin: 0 },
        } as Blog,
        ...prev,
      ]);
    }
    handleNewBlog();
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Editor</h1>
        <Button variant="squared:default" onClick={handleNewBlog}>
          <Plus className="mr-2 h-4 w-4" />
          New Blog
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Blog List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Blogs</h2>
            <div className="space-y-2">
              {blogs.map((blog) => (
                <div
                  key={blog.slug}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <h3 className="font-medium">{blog.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      Last modified:{" "}
                      {new Date(blog.lastModDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBlog(blog)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="danger"
                      onClick={() => handleDeleteBlog(blog)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="mb-4 text-lg font-semibold">Editor</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <input
                type="text"
                placeholder="Blog Title"
                className="w-full rounded-md border p-2"
                {...register("title", { required: true })}
              />
              {/* Summary */}
              <textarea
                placeholder="Summary (1-2 sentences)"
                className="w-full rounded-md border p-2"
                {...register("summary", { required: true, maxLength: 120 })}
                rows={2}
                maxLength={120}
              />
              {/* Category */}
              <div>
                <label className="mb-1 block font-medium">Category</label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-background hover:bg-accent focus:ring-accent flex w-full items-center justify-between rounded-md border px-3 py-2 text-left font-normal focus:ring-2"
                        >
                          <span>
                            {field.value
                              ? field.value.charAt(0) +
                                field.value.slice(1).toLowerCase()
                              : "Select category"}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-popover w-full min-w-[10rem] rounded-md border p-1 shadow-lg">
                        <DropdownMenuLabel>Select a category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(PostCategoryEnum).map((cat) => (
                          <DropdownMenuItem
                            key={cat}
                            onSelect={() => field.onChange(cat)}
                            className={
                              "flex cursor-pointer items-center gap-2 rounded px-3 py-2 transition-colors" +
                              (cat === field.value
                                ? " bg-accent text-accent-foreground"
                                : " hover:bg-muted focus:bg-muted")
                            }
                          >
                            {cat === field.value && (
                              <Check className="text-primary h-4 w-4" />
                            )}
                            <span>
                              {cat.charAt(0) + cat.slice(1).toLowerCase()}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
              </div>
              {/* Tags */}
              <div>
                <label className="mb-1 block font-medium">Tags</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
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
                  <input
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
              {/* isReleased toggle and metadata */}
              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register("isReleased")} />
                  <span>Released</span>
                </label>
                <span className="text-muted-foreground text-sm">
                  {`${minutesToRead} min read`} ({wordCount} words)
                </span>
              </div>
              {/* Content */}
              <textarea
                placeholder="Write your blog content in MDX..."
                className="h-[500px] w-full rounded-md border p-2 font-mono"
                {...register("content")}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="squared:outline"
                  type="button"
                  onClick={handleNewBlog}
                >
                  Cancel
                </Button>
                <Button variant="squared:default" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card w-full max-w-md rounded-lg border p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-bold">Delete Blog</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{blogToDelete?.title}</span>?
              <br />
              <span className="text-red-500">This action is irreversible.</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="squared:outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="squared:default" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default EditorPage;
