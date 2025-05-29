"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { logger } from "@ashgw/observability";

import { trpcClientSide } from "~/trpc/client";

export function useQueryParamBlog() {
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blog");

  const postsQuery = trpcClientSide.post.getAllPosts.useQuery();

  // Only fetch the specific post if we have a slug
  const getPostQuery = trpcClientSide.post.getPost.useQuery(
    { slug: blogSlug ?? "" },
    {
      enabled:
        !!blogSlug &&
        postsQuery.isSuccess &&
        !postsQuery.data.some((post) => post.slug === blogSlug),
      retry: 1,
      onError: (error) => {
        logger.error("Failed to load blog from URL", {
          error,
          blogSlug,
        });
        toast.error("Failed to load blog", {
          description: "The blog post could not be found",
        });
      },
    },
  );

  // Find blog either from the getAllPosts query or from the getPost query
  const blogFromUrl = blogSlug
    ? (postsQuery.data?.find((blog) => blog.slug === blogSlug) ??
      getPostQuery.data)
    : null;

  // Loading state - either getAllPosts is loading or getPost is loading
  const isLoadingBlog =
    (!!blogSlug && postsQuery.isLoading) || getPostQuery.isLoading;

  return {
    blogFromUrl,
    isLoadingBlog,
    blogSlug,
  };
}
