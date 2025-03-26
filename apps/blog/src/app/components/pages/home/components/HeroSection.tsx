import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Posts from "@/app/components/post/posts";
import { CREATOR } from "@/lib/constants";
import { pub } from "@/lib/env";
import { getSiteName } from "@/lib/funcs/site-name";
import { getBlogPosts } from "@/lib/mdx/content";

import { LoadingScreen } from "@ashgw/components";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  if (posts) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <section className="container mx-auto sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
          <h1 className="mb-8 hidden text-2xl font-medium tracking-tighter">
            Unclassified, raw
          </h1>
          <Posts posts={posts} />
          <div className="h-full w-auto"></div>
        </section>
        <div className="py-6"></div>
      </Suspense>
    );
  } else {
    return notFound();
  }
}
