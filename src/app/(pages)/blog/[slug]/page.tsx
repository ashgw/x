import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import { MetaDataAttributes } from '@/app/(pages)/blog/types';

type Slug = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<MetaDataAttributes | undefined> {
  let post = getBlogPosts().find((post) => post.filenameSlug === params.slug);
  if (!post) {
    return;
  }

  let { title, seoTitle, summary, firstModDate, lastModDate, isPublic } =
    post.parsedContent.attributes;
  return post.parsedContent.attributes;
}

function formatDate(date: string) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${fullDate} (${formattedDate})`;
}

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
            url: `https://ashgw.io/blog/${post.filenameSlug}`,
            author: {
              '@type': 'Person',
              name: 'AshGw',
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
