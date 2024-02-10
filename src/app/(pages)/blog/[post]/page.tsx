import { Suspense } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';
import { ChevronUp } from 'lucide-react';
import { notFound } from 'next/navigation';
import { pub } from '@/lib/env';
import { Badge } from '@/app/components/ui/badge';
import { getPost } from '@/app/actions/blog';
import Link from 'next/link';

export default async function Blog({ params }: { params: { post: string } }) {
  const post = await getPost(params.post);
  if (post !== undefined) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <main>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.parsedContent.attributes.title,
                datePublished: post.parsedContent.attributes.firstModDate,
                dateModified: post.parsedContent.attributes.lastModDate,
                description: post.parsedContent.attributes.seoTitle,
                url: pub.SITE_URL_PROD + `/blog/${post.filenameSlug}`,
                author: {
                  '@type': 'Person',
                  name: 'ashgw',
                },
              }),
            }}
          />
          <MediumSection>
            <H1 id={post.parsedContent.attributes.title}>
              {post.parsedContent.attributes.title}
            </H1>
            <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px]  md:max-w-[550px]  lg:max-w-[650px] xl:max-w-[750px] ">
              <p className="text-sm dimmed-0">
                {formatDate(post.parsedContent.attributes.firstModDate)}
              </p>
              <div>
                {isSameMonthAndYear(
                  post.parsedContent.attributes.firstModDate
                ) ? (
                  // TODO: replace with views
                  <Badge variant={'outlineSuccess'} className="opacity-0">
                    New
                  </Badge>
                ) : (
                  <Badge variant={'outlineSuccess'} className="opacity-0">
                    New
                  </Badge>
                )}
              </div>
            </div>
            <article className="text-wrap">
              <StyledMDX source={post.parsedContent.body}></StyledMDX>
            </article>
            <Link
              href={`#${post.parsedContent.attributes.title}`}
              className="fixed max-w-3 opacity-0 max-h-3 average-transition animate-bounce bottom-1 right-1 mx-12 md:px-18 lg:mx-24 xl:mx-[200px] my-12 hover:opacity-100"
            >
              <ChevronUp className="average-transition hover:scale-150" />
            </Link>
          </MediumSection>
        </main>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
