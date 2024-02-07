import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import type { Metadata, ResolvingMetadata } from 'next';

import { notFound } from 'next/navigation';
import { pub } from '@/lib/env';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import { Badge } from '@/app/components/ui/badge';

export default function Blog({ params }: { params: { slug: string } }) {
  let post = getBlogPosts().find((post) => post?.filenameSlug === params.slug);
  if (!post) {
    notFound();
  }
  // TODO: configure metadata

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
      <section className="dimmed-5 mx-auto container sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
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
          <StyledMDX source={post.parsedContent.body}></StyledMDX>
        </article>
      </section>
    </main>
  );
}
