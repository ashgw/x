import type { Metadata } from "next";
import merge from "lodash.merge";
import type { MaybeUndefined } from "ts-roids";
import { CREATOR, LINKS, SITE_NAME } from "@ashgw/constants";
import { env } from "@ashgw/env";

interface MetadataInput extends Omit<Metadata, "description" | "title"> {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const siteUrl = env.NEXT_PUBLIC_WWW_URL;
const applicationName = SITE_NAME;
const publisher = CREATOR;
const twitterHandle = LINKS.twitter.handle;
const defaultOg = { width: 1200, height: 630 } as const;

function toAbsolute(urlOrPath?: string): MaybeUndefined<string> {
  if (!urlOrPath) return;
  try {
    return new URL(urlOrPath).toString();
  } catch {
    return new URL(urlOrPath.replace(/^\/+/, ""), siteUrl).toString();
  }
}

export const createMetadata = ({
  title,
  description,
  image,
  canonical,
  ...properties
}: MetadataInput): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const fallbackOg = `${siteUrl}/opengraph-image.png`; //  already got this in each app
  const imageUrl = toAbsolute(image) ?? fallbackOg;
  const canonicalUrl = toAbsolute(canonical);

  const base: Metadata = {
    metadataBase: new URL(siteUrl),
    title: parsedTitle,
    description,
    applicationName,
    authors: [{ name: publisher, url: siteUrl }],
    creator: publisher,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    formatDetection: { telephone: false },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: defaultOg.width,
          height: defaultOg.height,
          alt: title,
        },
      ],
    },
    publisher,
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
      title: parsedTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  const metadata: Metadata = merge({}, base, properties);

  // If caller did not specify OG images in properties, enforce the computed one
  if (!properties.openGraph?.images) {
    metadata.openGraph = metadata.openGraph ?? {};
    metadata.openGraph.images = [
      {
        url: imageUrl,
        width: defaultOg.width,
        height: defaultOg.height,
        alt: title,
      },
    ];
  }

  return metadata;
};
