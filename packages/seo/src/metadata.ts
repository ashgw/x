import type { Metadata } from "next";
import merge from "lodash.merge";

import { CREATOR, LINKS, SITE_NAME } from "@ashgw/constants";
import { env } from "@ashgw/env";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
};

const applicationName = SITE_NAME;
const author: Metadata["authors"] = {
  name: CREATOR,
  url: env.NEXT_PUBLIC_WWW_URL,
};

const publisher = CREATOR;
const twitterHandle = LINKS.twitter.handle;

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;

export const createMetadata = ({
  title,
  description,
  image,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;
  const displayImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;
  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description,
    applicationName,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
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
      images: [
        {
          url: displayImageUrl,
          width: displayImageUrl,
          height: displayImageUrl,
          alt: title,
        },
      ],
    },
    publisher,
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
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

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return metadata;
};
