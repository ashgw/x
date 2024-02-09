import type { BlogData } from '@/lib/types/mdx';
import { Suspense } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';
import { Maybe } from '@/lib/types/global';
import { notFound } from 'next/navigation';
import { pub, nextJS } from '@/lib/env';
import { Badge } from '@/app/components/ui/badge';

const SITE_URL =
  nextJS.NEXT_NODE_ENV == 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;

async function getPost(slug: string): Promise<Maybe<BlogData>> {
  try {
    const response = await fetch(SITE_URL + '/api/blogs', {
      next: { revalidate: 7200 },
    });
    if (response.status == 200) {
      const result: { blogs: BlogData[] } = await response.json();
      let blogPost = result.blogs.find((p) => p?.filenameSlug === slug);
      return blogPost;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return;
  }
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (post) {
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
                url: SITE_URL + `/blog/${post.filenameSlug}`,
                author: {
                  '@type': 'Person',
                  name: 'ashgw',
                },
              }),
            }}
          />
          <MediumSection>
            <H1>{post.parsedContent.attributes.title}</H1>
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
          </MediumSection>
        </main>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
