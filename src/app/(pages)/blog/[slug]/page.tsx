import StyledMDX, { Heading as H1 } from '@/app/components/mdx/styled-mdx';
import formatDate from '@/lib/funcs/form-date';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { pub } from '@/lib/env';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import { Badge } from '@/app/components/ui/badge';
import Loader from '@/app/components/reusables/loader';
export default async function Blog({ params }: { params: { slug: string } }) {
  let post = getBlogPosts().find((post) => post?.filenameSlug === params.slug);
  if (!post) {
    notFound();
  }
  // TODO: use NEXT-SEO

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
      <section className="mx-auto container sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <H1>{post.parsedContent.attributes.title}</H1>
        <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px]  md:max-w-[550px]  lg:max-w-[650px] xl:max-w-[750px] ">
          <p className="text-sm dimmed0">
            {formatDate(post.parsedContent.attributes.firstModDate)}
          </p>
          <Suspense fallback={<Loader />}>
            <Badge variant={'success'}>New</Badge>
          </Suspense>
        </div>
        <article className="text-wrap">
          <StyledMDX source={post.parsedContent.body}></StyledMDX>
        </article>
      </section>
    </main>
  );
}
