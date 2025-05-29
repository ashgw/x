import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-lg border p-4"
      >
        <h2 className="mb-4 text-lg font-semibold">Posts</h2>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b pb-4 last:border-0 last:pb-0"
            >
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-1 h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-lg border p-4"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-4 text-lg font-semibold"
      >
        Posts
      </motion.h2>
      {blogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground py-8 text-center"
        >
          No posts found. Create your first post by clicking "New Blog".
        </motion.div>
      ) : (
        <ScrollArea className="h-[850px] pr-4">
          <div className="space-y-4">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                className="rounded-md border-b p-3 pb-4 last:border-0 last:pb-0"
              >
                <h3 className="font-medium">{blog.title}</h3>
                <div className="text-muted-foreground mb-2 flex text-xs">
                  <span className="mr-2">
                    {blog.isReleased ? "Released" : "Draft"}
                  </span>
                  <span>{new Date(blog.lastModDate).toLocaleDateString()}</span>
                </div>
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
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
                </motion.div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
}
