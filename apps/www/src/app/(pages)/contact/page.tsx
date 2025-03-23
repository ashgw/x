import type { Metadata } from "next";

import { CREATOR, SITE_NAME } from "@ashgw/constants";
import { env } from "@ashgw/env";

import { ContactPage } from "~/app/components/pages/contact";

const PAGE_URL = new URL(env.NEXT_PUBLIC_WWW_URL + "/contact");
const title = "Contact";
const description = "Feel free to reach out";
const kw: string[] = [CREATOR, "ashgw", "contact"];

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;
const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;

export const metadata: Metadata = {
  metadataBase: PAGE_URL,
  title: {
    default: title,
    template: "%s | Ashgw",
  },
  creator: CREATOR,
  keywords: kw,
  description: description,
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    publishedTime: "2023-12-01T09:15:00-0401",
    title,
    description,
    type: "article",
    url: PAGE_URL,
    images: [
      {
        url: postImageUrl,
        width: postImageWidth,
        height: postImageHeight,
        alt: title,
      },
    ],
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
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [postImageUrl],
  },
  category: "tech",
};

export default function Page() {
  return <ContactPage />;
}
