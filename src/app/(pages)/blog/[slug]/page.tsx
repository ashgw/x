'use client';

import { useState, useEffect } from 'react';
import type { BlogData } from '../_types';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import StyledMDX from '@/app/components/mdx/styled-mdx';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { formatDate, isSameMonthAndYear } from '@/lib/funcs/dates';
import { MediumSection } from '@/app/components/reusables/sections';

import { notFound } from 'next/navigation';
import { pub } from '@/lib/env';
import { getBlogPosts } from '@/app/(pages)/blog/content';
import { Badge } from '@/app/components/ui/badge';
export default function Blog({ params }: { params: { slug: string } }) {
  // TODO: configure metadata

  const [blogPost, setBlogPost] = useState<BlogData | undefined>();
  const [loaded, setLoaded] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/blogs/${params.slug}`
        );
        if (response.ok) {
          const data = await response.json();
          setBlogPost(data);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      } finally {
        setLoaded(1);
      }
    };

    fetchData();
  }, [params.slug]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  if (loaded && blogPost === undefined) {
    return notFound();
  }

  if (loaded && blogPost !== undefined) {
    let a = blogPost.parsedContent.body;
    return (
      <main>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: blogPost.parsedContent.attributes.title,
              datePublished: blogPost.parsedContent.attributes.firstModDate,
              dateModified: blogPost.parsedContent.attributes.lastModDate,
              description: blogPost.parsedContent.attributes.seoTitle,
              url: pub.SITE_URL_PROD + `/blog/${blogPost.filenameSlug}`,
              author: {
                '@type': 'Person',
                name: 'ashgw',
              },
            }),
          }}
        />
        <MediumSection>
          <H1>{blogPost.parsedContent.attributes.title}</H1>
          <div className="flex justify-between items-center mb-8 text-sm sm:max-w-[450px]  md:max-w-[550px]  lg:max-w-[650px] xl:max-w-[750px] ">
            <p className="text-sm dimmed-0">
              {formatDate(blogPost.parsedContent.attributes.firstModDate)}
            </p>
            <div>
              {isSameMonthAndYear(
                blogPost.parsedContent.attributes.firstModDate
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
            <StyledMDX source={a}></StyledMDX>
          </article>
        </MediumSection>
      </main>
    );
  }
}
