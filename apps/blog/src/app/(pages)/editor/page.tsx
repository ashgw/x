import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@ashgw/ui";

// Dummy data for now
const dummyBlogs = [
  {
    id: 1,
    title: "Cholesterol",
    lastModified: "2024-02-07",
    status: "Published",
  },
  {
    id: 2,
    title: "Code or Capital",
    lastModified: "2023-12-14",
    status: "Published",
  },
  // Add more dummy blogs as needed
];

export default function EditorPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Mock edit handler
  function handleEditBlog(blog) {
    setSelectedBlog(blog);
    setTitle(blog.title);
    setContent(blog.content || "");
    console.log("Editing blog:", blog);
  }

  // Mock delete handler
  function handleDeleteBlog(blog) {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (blogToDelete) {
      console.log("Deleting blog:", blogToDelete);
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
        <Button color="primary">
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
                  key={blog.id}
                  className="hover:bg-accent flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <h3 className="font-medium">{blog.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      Last modified: {blog.lastModified}
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
              <input
                type="text"
                placeholder="Blog Title"
                className="w-full rounded-md border p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Write your blog content in MDX..."
                className="h-[500px] w-full rounded-md border p-2 font-mono"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button color="primary">Save</Button>
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
              <Button variant="ghost" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button color="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
