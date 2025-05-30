"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { logger } from "@ashgw/observability";

import type { PostDetailRo } from "~/api/models/post";
import { trpcClientSide } from "~/trpc/client";

interface UseQueryParamBlogProps {
  onBlogFound?: (blog: PostDetailRo) => void;
  skipLoading?: boolean; // Add flag to skip loading blogs
}

export function useQueryParamBlog({
  onBlogFound,
  skipLoading = false,
}: UseQueryParamBlogProps = {}) {
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blog");

  const postsQuery = trpcClientSide.post.getAllPosts.useQuery();

  // Only fetch the specific post if we have a slug and not skipping loading
  const getPostQuery = trpcClientSide.post.getPost.useQuery(
    { slug: blogSlug ?? "" },
    {
      enabled:
        !skipLoading &&
        !!blogSlug &&
        postsQuery.isSuccess &&
        !postsQuery.data.some((post) => post.slug === blogSlug),
      retry: 1,
    },
  );

  // Handle errors from the specific post query
  useEffect(() => {
    if (getPostQuery.isError) {
      logger.error("Failed to load blog from URL", {
        error: getPostQuery.error,
        blogSlug,
      });
      toast.error("Failed to load blog", {
        description: "The blog post could not be found",
      });
    }
  }, [getPostQuery.isError, getPostQuery.error, blogSlug]);

  // Find blog either from the getAllPosts query or from the getPost query
  const blogFromUrl = blogSlug
    ? (postsQuery.data?.find((blog) => blog.slug === blogSlug) ??
      getPostQuery.data)
    : null;

  // Call the callback when we find a blog, but only if not skipping
  useEffect(() => {
    if (!skipLoading && blogFromUrl && onBlogFound) {
      onBlogFound(blogFromUrl);
    }
  }, [blogFromUrl, onBlogFound, skipLoading]);

  // Loading state - either getAllPosts is loading or getPost is loading
  const isLoadingBlog =
    !skipLoading &&
    !!blogSlug &&
    (postsQuery.isLoading || getPostQuery.isLoading);

  return {
    blogFromUrl,
    isLoadingBlog,
    blogSlug,
  };
}
