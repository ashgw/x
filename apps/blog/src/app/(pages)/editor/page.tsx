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
  const [content, setContent] = useState("");

  // Mock edit handler
  function handleEditBlog(blog: Blog) {
    setTitle(blog.title);
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
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    placeholder="Blog Title"
                    className="w-full rounded-md border p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Slug"
                    className="mt-2 w-full rounded-md border p-2"
                    value={title}
                    readOnly
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => blogToDelete && handleEditBlog(blogToDelete)}
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    color="danger"
                    onClick={() =>
                      blogToDelete && handleDeleteBlog(blogToDelete)
                    }
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
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
