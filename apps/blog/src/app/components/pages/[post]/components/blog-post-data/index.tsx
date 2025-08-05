"use client";

import { memo } from "react";
import Link from "next/link";
import { Edit, Eye } from "lucide-react";

import { DateService } from "@ashgw/cross-runtime";
import { Badge, Button } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models";
import { featuredComponents } from "~/app/components/pages/[post]/components/mdx-custom/featured/blog";
import { ScrollUp } from "~/app/components/pages/home/components/postCards/components/ScrollUp";
import { formatViews } from "~/utils/formatViews";
import { H1 } from "../mdx-custom/headers";
import { MDX } from "../mdx-custom/mdx";
import { ReleaseDate } from "./ReleaseDate";
import { ViewTracker } from "./ViewTracker";

interface BlogPostProps {
  postData: PostDetailRo;
}

export const BlogPostData = memo(function BlogPostData({
  postData,
}: BlogPostProps) {
  return (
    <section className="container mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      <ViewTracker postSlug={postData.slug} />
      <div className="flex items-center justify-between">
        <H1 id={postData.title}>{postData.title}</H1>
        <Link href={`/editor?blog=${postData.slug}`} className="ml-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label={`Edit blog post: ${postData.title}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between text-sm sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px]">
        <div className="text-muted-foreground flex items-center gap-2">
          <ReleaseDate date={postData.firstModDate.toISOString()} />
          <span className="scale-150 select-none text-white/40">·</span>
          <div
            className="flex items-center gap-1"
            title={`${postData.views} views`}
          >
            <Eye className="h-3 w-3 opacity-70" />
            <span className="text-sm opacity-70">
              {formatViews(postData.views)}
            </span>
          </div>
        </div>
        <div>
          {DateService.isSameMonthAndYear({
            stringDate: postData.firstModDate.toISOString(),
          }) ? (
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant="outlineUpdated">Recent</Badge>
            </div>
          ) : (
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant="outlineArchive">Archive</Badge>
            </div>
          )}
        </div>
      </div>
      <article className="text-wrap">
        <MDX
          source={postData.fontMatterMdxContent.body}
          components={featuredComponents}
        />
      </article>
      <ScrollUp />
    </section>
  );
});
