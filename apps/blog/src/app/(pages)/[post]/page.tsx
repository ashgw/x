import { cache } from "react";
import type { Metadata } from "next";
import { NotFound } from "@ashgw/components";
import {
  createMetadata,
  JsonLd,
  blogPostingJsonLd,
  breadcrumbsJsonLd,
} from "@ashgw/seo";
import { env } from "@ashgw/env";
import { BlogPostPage } from "~/app/components/pages/[post]";
import { HydrateClient, trpcServerSide } from "~/trpc/server";

const siteUrl = env.NEXT_PUBLIC_BLOG_URL;

// Per-request memoization for this slug
const getPostCached = cache((slug: string) =>
  trpcServerSide.post.getPost({ slug }),
);

export async function generateMetadata({
  params,
}: {
  params: { post: string };
}): Promise<Metadata> {
  const postData = await getPostCached(params.post);
  if (!postData) {
    return {
      title: "Post not found",
      description: `The post (${params.post}) was not found`,
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    };
  }
  const isDraft = !postData.isReleased;
  return createMetadata({
    title: postData.title,
    robots: isDraft
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : undefined,
    description: postData.seoTitle,
    keywords: postData.tags,
  });
}

export default async function Page({ params }: { params: { post: string } }) {
  const postData = await getPostCached(params.post);
  if (!postData)
    return <NotFound message={`No post found that matches /${params.post}`} />;

  return (
    <HydrateClient>
      <JsonLd
        code={blogPostingJsonLd({
          post: {
            slug: postData.slug,
            title: postData.title,
            description: postData.summary,
            tags: postData.tags,
            publishedAt: postData.firstModDate.toISOString(),
            updatedAt: postData.lastModDate.toISOString(),
          },
          siteUrl,
        })}
      />
      <JsonLd
        code={breadcrumbsJsonLd([
          { name: "Blog", url: `${siteUrl}` },
          { name: postData.title, url: `${siteUrl}/${postData.slug}` },
        ])}
      />
      <BlogPostPage postData={postData} />
    </HydrateClient>
  );
}
