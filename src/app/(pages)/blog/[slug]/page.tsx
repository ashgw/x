import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import formatDate from '@/lib/funcs/form-date';
import { pub } from '@/lib/env';

export default function Blog({ params }: { params: { slug: string } }) {
  let post = getBlogPosts().find((post) => post?.filenameSlug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
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
            description: post.parsedContent.attributes.summary,
            url: pub.SITE_URL_PROD + `/blog/${post.filenameSlug}`,
            author: {
              '@type': 'Person',
              name: 'ashgw',
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.parsedContent.attributes.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.parsedContent.attributes.firstModDate)}
        </p>
        <Suspense fallback={<p className="h-5" />}>
          <h3>Views are supposed to be here</h3>
        </Suspense>
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <StyledMDX source={post.parsedContent.body}></StyledMDX>
      </article>
    </section>
  );
}
