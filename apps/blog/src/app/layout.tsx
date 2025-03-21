import "@ashgw/css/global";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import localFont from "next/font/local";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ArrowLeft } from "lucide-react";

import { NamesService } from "@ashgw/cross-runtime";
import { env } from "@ashgw/env";

import { Providers } from "./components/providers";

const atkinsonHyperlegible = localFont({
  src: [
    {
      path: "./../../../../assets/fonts/AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../../../../assets/fonts/AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./../../../../assets/fonts/AtkinsonHyperlegible/AtkinsonHyperlegible-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./../../../../assets/fonts/AtkinsonHyperlegible/AtkinsonHyperlegible-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-atkinson-hyperlegible",
  display: "swap", // Enable font swapping for better performance
});

const title = "Ashref Gwader";
const description =
  "Developer, writer, and self-proclaimed modern day philosopher.";
const url = new URL(env.NEXT_PUBLIC_WWW_URL);
const kw: string[] = ["Ashref Gwader", "ashgw", "blog", "tech", "TS", "Python"];

const postImageWidth = 1200; // in pixels
const postImageHeight = 630;
const postImageUrl = `https://via.placeholder.com/${postImageWidth}x${postImageHeight}.png/000000/ffffff/?text=${title}`;

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_WWW_URL),
  title: {
    default: "Ashref Gwader",
    template: "%s | Ashgw",
  },
  creator: "Ashref Gwader",
  keywords: kw,
  description: description,
  openGraph: {
    siteName:
      NamesService.getSiteName({
        url: env.NEXT_PUBLIC_WWW_URL,
      }) ?? "ashgw",
    locale: "en_US",
    publishedTime: "2023-12-01T09:15:00-0401",
    title,
    description,
    type: "article",
    url,
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

function BackToHome() {
  return (
    <div className="container pt-6">
      <Link
        href="https://www.ashgw.me"
        className="text-muted-foreground hover:text-foreground highlight-underline mb-8 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 font-bold" />
        <span className="font-bold">Back to Home</span>
      </Link>
    </div>
  );
}
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={atkinsonHyperlegible.className}>
        <BackToHome />
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_BLOG_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
