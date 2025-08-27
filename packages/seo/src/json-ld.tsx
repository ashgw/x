import type {
  Thing,
  WithContext,
  Organization,
  WebSite,
  BlogPosting,
  BreadcrumbList,
} from "schema-dts";
import { env } from "@ashgw/env";
import { SITE_NAME, CREATOR } from "@ashgw/constants";

interface JsonLdProps {
  code: WithContext<Thing>;
}

export const JsonLd = ({ code }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(code) }}
  />
);

const siteUrl = env.NEXT_PUBLIC_WWW_URL;

export const organizationJsonLd = (): WithContext<Organization> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: SITE_NAME,
  url: siteUrl,
});

export const websiteJsonLd = (): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: SITE_NAME,
  publisher: { "@id": `${siteUrl}/#organization` },
});

export interface PostLike {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO
  updatedAt?: string; // ISO
  tags?: string[];
  category?: string;
}

export const blogPostingJsonLd = (post: PostLike): WithContext<BlogPosting> => {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    isPartOf: { "@id": `${siteUrl}/#website` },
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: CREATOR, "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#organization` },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "en",
    keywords: post.tags ?? [],
    articleSection: post.category,
  };
};

export const breadcrumbsJsonLd = (
  segments: { name: string; url: string }[],
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: segments.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.name,
    item: s.url,
  })),
});

export * from "schema-dts";
