import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button, ScrollArea, Skeleton } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";

interface BlogListProps {
  blogs: PostDetailRo[];
  onEdit: (blog: PostDetailRo) => void;
  onDelete: (blog: PostDetailRo) => void;
  isLoading?: boolean;
}

const BlogItem = memo(
  ({
    blog,
    index,
    onEdit,
    onDelete,
    shouldReduceMotion,
  }: {
    blog: PostDetailRo;
    index: number;
    onEdit: (blog: PostDetailRo) => void;
    onDelete: (blog: PostDetailRo) => void;
    shouldReduceMotion: boolean;
  }) => {
    const initialAnimation = shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: -30 };

    const animateAnimation = shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0 };

    return (
      <motion.div
        key={blog.slug}
        initial={initialAnimation}
        animate={animateAnimation}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.4,
          delay: shouldReduceMotion ? 0 : index * 0.05,
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: shouldReduceMotion ? undefined : 100,
        }}
        className="rounded-md border-b p-3 pb-4 last:border-0 last:pb-0"
      >
        <h3 className="font-medium">{blog.title}</h3>
        <div className="text-muted-foreground mb-2 flex text-xs">
          <span className="mr-2">{blog.isReleased ? "Released" : "Draft"}</span>
          <span>{new Date(blog.lastModDate).toLocaleDateString()}</span>
        </div>
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.3,
            delay: shouldReduceMotion ? 0 : 0.1 + index * 0.05,
          }}
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
    );
  },
);

export const BlogList = memo(
  ({ blogs, onEdit, onDelete, isLoading }: BlogListProps) => {
    const shouldReduceMotion = useReducedMotion();

    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
          className="bg-card rounded-lg border p-4"
        >
          <h2 className="mb-4 text-lg font-semibold">Posts</h2>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.3,
                  delay: shouldReduceMotion ? 0 : i * 0.05,
                }}
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
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
        className="bg-card rounded-lg border p-4"
      >
        <motion.h2
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.3,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
          className="mb-4 text-lg font-semibold"
        >
          Posts
        </motion.h2>
        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.2,
            }}
            className="text-muted-foreground py-8 text-center"
          >
            No posts found. Create your first post by clicking "New Blog".
          </motion.div>
        ) : (
          <ScrollArea className="h-[980px] pr-4">
            <div className="space-y-4 pb-4">
              {blogs.map((blog, index) => (
                <BlogItem
                  key={blog.slug}
                  blog={blog}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  shouldReduceMotion={!!shouldReduceMotion}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </motion.div>
    );
  },
);

BlogItem.displayName = "BlogItem";
BlogList.displayName = "BlogList";
