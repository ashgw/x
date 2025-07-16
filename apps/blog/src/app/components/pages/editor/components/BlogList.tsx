"use client";

import { Edit, Eye, Trash2 } from "lucide-react";

import { DateService } from "@ashgw/cross-runtime";
import { Badge } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";
import { PostCategoryEnum } from "~/api/models/post";
import { formatViews } from "~/utils/formatViews";

export interface BlogListProps {
  blogs: PostDetailRo[];
  onEdit: (blog: PostDetailRo) => void;
  onDelete: (blog: PostDetailRo) => void;
}

export function BlogList({ blogs, onEdit, onDelete }: BlogListProps) {
  const getCategoryColor = (category: PostCategoryEnum) => {
    switch (category) {
      case PostCategoryEnum.SOFTWARE:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case PostCategoryEnum.HEALTH:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case PostCategoryEnum.PHILOSOPHY:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Blog Posts ({blogs.length})</h2>
      <div className="space-y-2">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className="flex items-center justify-between rounded-lg border border-white/10 p-4 hover:border-white/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{blog.title}</h3>
                <Badge
                  className={`text-xs ${getCategoryColor(blog.category)}`}
                  variant="outline"
                >
                  {blog.category}
                </Badge>
                {blog.isReleased ? (
                  <Badge variant="outlineUpdated" className="text-xs">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outlineArchive" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/60">{blog.summary}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
                <span>
                  {DateService.formatDate({
                    stringDate: blog.firstModDate.toISOString(),
                  })}
                </span>
                <span>•</span>
                <span>{blog.tags.join(", ")}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(blog.views)} views</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(blog)}
                className="rounded p-2 hover:bg-white/10"
                aria-label={`Edit ${blog.title}`}
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(blog)}
                className="rounded p-2 hover:bg-red-500/20"
                aria-label={`Delete ${blog.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
