import { Button, ScrollArea, Skeleton } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";

interface BlogListProps {
  blogs: PostDetailRo[];
  onEdit: (blog: PostDetailRo) => void;
  onDelete: (blog: PostDetailRo) => void;
  isLoading?: boolean;
}

export function BlogList({
  blogs,
  onEdit,
  onDelete,
  isLoading,
}: BlogListProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Posts</h2>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-1 h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">Posts</h2>
      {blogs.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          No posts found. Create your first post by clicking "New Blog".
        </div>
      ) : (
        <ScrollArea className="h-[850px] pr-4">
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.slug}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <h3 className="font-medium">{blog.title}</h3>
                <div className="text-muted-foreground mb-2 flex text-xs">
                  <span className="mr-2">
                    {blog.isReleased ? "Released" : "Draft"}
                  </span>
                  <span>{new Date(blog.lastModDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="squared:outline"
                    size="sm"
                    onClick={() => onEdit(blog)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(blog)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
