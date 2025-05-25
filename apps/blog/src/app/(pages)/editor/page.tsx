"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { logger } from "@ashgw/observability";
import { Button } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<PostCategoryEnum | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isReleased, setIsReleased] = useState(false);
  const [content, setContent] = useState("");

  // Auto-calculate minutes to read (200 wpm)
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutesToRead =
    wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : 0;

  // Tag add/remove handlers
  function handleAddTag() {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput("");
  }
  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  // Mock edit handler
  function handleEditBlog(blog: Blog) {
    setTitle(blog.title);
    setSummary(blog.summary);
    setCategory(blog.category);
    setTags(blog.tags);
    setIsReleased(blog.isReleased);
    setContent(blog.fontMatterMdxContent.body);
    logger.info("Editing blog:", blog);
  }

  // Mock delete handler
  function handleDeleteBlog(blog: Blog) {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (blogToDelete) {
      logger.info("Deleting blog:", blogToDelete);
      // Here you would call your real delete logic
    }
    setShowDeleteModal(false);
    setBlogToDelete(null);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Editor</h1>
        <Button variant="squared:default">
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
              {dummyBlogs.map((blog) => (
                <div
                  key={blog.slug}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <h3 className="font-medium">{blog.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      Last modified: {blog.lastModDate.toLocaleDateString()}
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
            <div className="space-y-4">
              {/* Title */}
              <input
                type="text"
                placeholder="Blog Title"
                className="w-full rounded-md border p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* Summary */}
              <textarea
                placeholder="Summary (1-2 sentences)"
                className="w-full rounded-md border p-2"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                maxLength={120}
              />
              {/* Category */}
              <div>
                <label className="mb-1 block font-medium">Category</label>
                <select
                  className="w-full rounded-md border p-2"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as PostCategoryEnum)
                  }
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {Object.values(PostCategoryEnum).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
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
                  <Button size="sm" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              </div>
              {/* isReleased toggle and metadata */}
              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isReleased}
                    onChange={() => setIsReleased((v) => !v)}
                  />
                  <span>Released</span>
                </label>
                <span className="text-muted-foreground text-sm">
                  {minutesToRead > 0 && `${minutesToRead} min read`} (
                  {wordCount} words)
                </span>
              </div>
              {/* Content */}
              <textarea
                placeholder="Write your blog content in MDX..."
                className="h-[500px] w-full rounded-md border p-2 font-mono"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="squared:outline">Cancel</Button>
                <Button variant="squared:default">Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
      )}
    </div>
  );
}

export default EditorPage;
