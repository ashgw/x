import type { BlogData } from '@/lib/types/mdx';
import { BLOG_URI } from '@/lib/constants';
import { pub } from '@/lib/env';

export default function SEO({ post }: { post: BlogData }) {
  return (
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
          url: pub.SITE_URL_PROD + BLOG_URI + `/${post.filenameSlug}`,
          author: {
            '@type': 'Person',
            name: 'ashgw',
          },
        }),
      }}
    />
  );
}
