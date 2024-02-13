import type { BlogData } from '@/lib/types/mdx';
import { BLOG_URI } from '@/lib/constants';
import { pub } from '@/lib/env';

export default function SEO({ post }: { post: BlogData }) {
  const title = post.parsedContent.attributes.title;
  const imageUrl = `https://via.placeholder.com/1200x630.png/007ACC/fff/?text=${title}`;
  console.log(imageUrl);
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
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
