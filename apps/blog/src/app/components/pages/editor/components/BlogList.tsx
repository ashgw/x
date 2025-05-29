import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models";

type Post = PostDetailRo;

export function BlogList({
  blogs,
  onEdit,
  onDelete,
}: {
  blogs: Post[];
  onEdit: (blog: Post) => void;
  onDelete: (blog: Post) => void;
}) {
  return (
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
                  onClick={() => onEdit(blog)}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  color="danger"
                  onClick={() => onDelete(blog)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
