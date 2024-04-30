import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';
import BackUpTop from '@/app/components/reusables/back-up-top';
import type { PostData } from '@/lib/types/mdx';
import { Badge } from '@/app/components/ui/badge';
import { CreationDate } from './creation-date';

type _Props = {
  post: PostData;
  forBusiness?: boolean;
};
export default function PostSection({ post, forBusiness }: _Props) {
  return (
    <MediumSection>
      <H1 id={post.parsedContent.attributes.title}>
        {post.parsedContent.attributes.title}
      </H1>
      {forBusiness ? (
        <div className="my-10"></div>
      ) : (
        <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] ">
          <CreationDate date={post.parsedContent.attributes.firstModDate} />
          <div>
            {isSameMonthAndYear(post.parsedContent.attributes.firstModDate) &&
            !forBusiness ? (
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
      )}
      <article className="text-wrap">
        <StyledMDX source={post.parsedContent.body}></StyledMDX>
      </article>
      <BackUpTop />
    </MediumSection>
  );
}
