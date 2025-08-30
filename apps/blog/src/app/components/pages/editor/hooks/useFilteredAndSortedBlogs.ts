import type { MaybeUndefined } from "ts-roids";
import { useMemo } from "react";

import type { SortOptions } from "../components/header/components/SortOptions";
import type { PostDetailRo } from "~/api/models/post";

export function useFilteredAndSortedBlogs(
  blogs: MaybeUndefined<PostDetailRo[]>,
  sortOptions: SortOptions,
) {
  return useMemo(() => {
    if (!blogs) return [];

    let filtered = [...blogs];

    // Status filter
    if (sortOptions.statusFilter !== "all") {
      const isReleased = sortOptions.statusFilter === "released";
      filtered = filtered.filter((blog) => blog.isReleased === isReleased);
    }

    // Category filter
    if (sortOptions.categoryFilter !== "all") {
      filtered = filtered.filter(
        (blog) => blog.category === sortOptions.categoryFilter,
      );
    }

    // Tag filter
    if (sortOptions.tagFilter !== null) {
      const tagToFilter = sortOptions.tagFilter;
      filtered = filtered.filter((blog) => blog.tags.includes(tagToFilter));
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortOptions.sortField];
      const bValue = b[sortOptions.sortField];

      if (
        sortOptions.sortField === "lastModDate" ||
        sortOptions.sortField === "firstModDate"
      ) {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortOptions.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOptions.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [blogs, sortOptions]);
}
