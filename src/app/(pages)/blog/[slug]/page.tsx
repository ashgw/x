import type { BlogData } from '../_types';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';

import { notFound } from 'next/navigation';
import { pub } from '@/lib/env';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import { Badge } from '@/app/components/ui/badge';

enum _Result {
  Found,
  Loading,
  NotFound,
  Error,
}

// TODO: metadata
export default async function Blog({ params }: { params: { slug: string } }) {
  let post;
  try {
    const response = await fetch('http://localhost:3000/api/blogs', {
      next: { revalidate: 7200 },
    });
    if (response.status == 200) {
      const result: { blogs: BlogData[] } = await response.json();
      let blogPost = result.blogs.find((p) => p?.filenameSlug === params.slug);
      post = blogPost;
    } else {
      console.error('Error fetching data:', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  if (!post) {
    return notFound();
  }
  let a = post.parsedContent.body;
  return (
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
        <H1>{post.parsedContent.attributes.title}</H1>
        <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px]  md:max-w-[550px]  lg:max-w-[650px] xl:max-w-[750px] ">
          <p className="text-sm dimmed-0">
            {formatDate(post.parsedContent.attributes.firstModDate)}
          </p>
          <div>
            {isSameMonthAndYear(post.parsedContent.attributes.firstModDate) ? (
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
          <StyledMDX source={a}></StyledMDX>
        </article>
      </MediumSection>
    </main>
  );
}
