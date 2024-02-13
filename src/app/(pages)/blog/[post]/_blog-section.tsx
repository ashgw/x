import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';
import BackUpTop from '@/app/components/reusables/back-up-top';
import type { BlogData } from '@/lib/types/mdx';
import { Badge } from '@/app/components/ui/badge';




export default function BlogSection({ post }: { post: BlogData }) {
  return (
    <MediumSection>
      <H1 id={post.parsedContent.attributes.title}>
        {post.parsedContent.attributes.title}
      </H1>
      <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px]  md:max-w-[550px]  lg:max-w-[650px] xl:max-w-[750px] ">
        <p className="text-sm dimmed-0">
          {formatDate(post.parsedContent.attributes.firstModDate)}
        </p>
        <div>
          {isSameMonthAndYear(post.parsedContent.attributes.firstModDate) ? (
            // TODO: replace with views
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant={'outlineUpdated'}>Recent</Badge>
            </div>
          ) : (
            <div className="average-transition opacity-0 hover:opacity-100">
              <Badge variant={'outlineArchive'}>Archive</Badge>
            </div>
          )}
        </div>
      </div>
      <article className="text-wrap">
        <StyledMDX source={post.parsedContent.body}></StyledMDX>
      </article>
      <BackUpTop />
    </MediumSection>
  );
}
