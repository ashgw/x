import StyledMDX from "@/app/components/mdx/styled-mdx";

import { BackUpTop, H1 } from "@ashgw/components";
import { DateService } from "@ashgw/cross-runtime";
import { Badge } from "@ashgw/ui";

import type { PostData } from "~/lib";
import { ReleaseDate } from "./ReleaseDate";

interface BlogPostPorps {
  postData: PostData;
}

export function BlogPostData({ postData }: BlogPostPorps) {
  return (
    <section className="container mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      <H1 id={post.parsedContent.attributes.title}>
        {post.parsedContent.attributes.title}
      </H1>
      <div className="mb-8 flex items-center justify-between text-sm sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px]">
        <ReleaseDate date={post.parsedContent.attributes.firstModDate} />
        <div>
          {DateService.isSameMonthAndYear({
            stringDate: post.parsedContent.attributes.firstModDate,
          }) ? (
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant={"outlineUpdated"}>Recent</Badge>
            </div>
          ) : (
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant={"outlineArchive"}>Archive</Badge>
            </div>
          )}
        </div>
      </div>
      <article className="text-wrap">
        <StyledMDX source={post.parsedContent.body}></StyledMDX>
      </article>
      <BackUpTop />
    </section>
  );
}
