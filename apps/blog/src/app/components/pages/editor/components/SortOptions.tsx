"use client";

import { motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  Tag,
} from "lucide-react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";
import { PostCategoryEnum } from "~/api/models/post";

export type SortField = "title" | "lastModDate" | "firstModDate";
export type SortOrder = "asc" | "desc";
export type StatusFilter = "all" | "released" | "draft";
export type CategoryFilter = PostCategoryEnum | "all";
export type TagFilter = string | null;

export interface SortOptions {
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: StatusFilter;
  categoryFilter: CategoryFilter;
  tagFilter: TagFilter;
}

interface SortOptionsProps {
  options: SortOptions;
  onOptionsChange: (options: SortOptions) => void;
  blogs: PostDetailRo[];
}

const formatCategoryName = (category: string): string => {
  return category.charAt(0) + category.slice(1).toLowerCase();
};

export function SortOptions({
  options,
  onOptionsChange,
  blogs,
}: SortOptionsProps) {
  // Extract all unique tags from the blogs
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags)),
  ).sort();

  // Helper to update sort options
  const updateOptions = (newOptions: Partial<SortOptions>) => {
    onOptionsChange({ ...options, ...newOptions });
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    updateOptions({ sortOrder: options.sortOrder === "asc" ? "desc" : "asc" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sort Field and Order */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex h-8 items-center gap-1"
            >
              <span>Sort</span>
              {options.sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ sortField: "title" })}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Title
                </span>
                {options.sortField === "title" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ sortField: "lastModDate" })}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Last Modified
                </span>
                {options.sortField === "lastModDate" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ sortField: "firstModDate" })}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Created Date
                </span>
                {options.sortField === "firstModDate" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
            <DropdownMenuSeparator />
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem onClick={toggleSortOrder}>
                <span className="flex items-center">
                  {options.sortOrder === "asc" ? (
                    <>
                      <SortAsc className="mr-2 h-4 w-4" />
                      Ascending
                    </>
                  ) : (
                    <>
                      <SortDesc className="mr-2 h-4 w-4" />
                      Descending
                    </>
                  )}
                </span>
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Status Filter */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex h-8 items-center gap-1"
            >
              <span>Status</span>
              <Filter className="h-4 w-4" />
              {options.statusFilter !== "all" && (
                <Badge
                  variant={
                    options.statusFilter === "released" ? "success" : "outline"
                  }
                  className="ml-1 px-1 py-0 text-xs"
                >
                  {options.statusFilter === "released" ? "Released" : "Draft"}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ statusFilter: "all" })}
                className="flex items-center justify-between"
              >
                <span>All</span>
                {options.statusFilter === "all" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ statusFilter: "released" })}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Released
                </span>
                {options.statusFilter === "released" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ statusFilter: "draft" })}
                className="flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Circle className="mr-2 h-4 w-4" />
                  Draft
                </span>
                {options.statusFilter === "draft" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Category Filter */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex h-8 items-center gap-1"
            >
              <span>Category</span>
              <Filter className="h-4 w-4" />
              {options.categoryFilter !== "all" && (
                <Badge className="ml-1 px-1 py-0 text-xs">
                  {formatCategoryName(options.categoryFilter)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <motion.div
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <DropdownMenuItem
                onClick={() => updateOptions({ categoryFilter: "all" })}
                className="flex items-center justify-between"
              >
                <span>All Categories</span>
                {options.categoryFilter === "all" && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </motion.div>
            {Object.values(PostCategoryEnum).map((category) => (
              <motion.div
                key={category}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <DropdownMenuItem
                  onClick={() => updateOptions({ categoryFilter: category })}
                  className="flex items-center justify-between"
                >
                  <span>{formatCategoryName(category)}</span>
                  {options.categoryFilter === category && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </motion.div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Tag Filter */}
      {allTags.length > 0 ? (
        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex h-8 items-center gap-1"
              >
                <span>Tag</span>
                <Tag className="h-4 w-4" />
                {options.tagFilter && (
                  <Badge className="ml-1 px-1 py-0 text-xs">
                    {options.tagFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-[300px] w-[180px] overflow-y-auto"
            >
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <DropdownMenuItem
                  onClick={() => updateOptions({ tagFilter: null })}
                  className="flex items-center justify-between"
                >
                  <span>All Tags</span>
                  {options.tagFilter === null && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </motion.div>
              {allTags.map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                >
                  <DropdownMenuItem
                    onClick={() => updateOptions({ tagFilter: tag })}
                    className="flex items-center justify-between"
                  >
                    <span>{tag}</span>
                    {options.tagFilter === tag && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
