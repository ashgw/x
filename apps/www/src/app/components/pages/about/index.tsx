"use client";

import React from "react";

import { Footer } from "@ashgw/components";
import { env } from "@ashgw/env";

import AboutCard from "./components/AboutCard";
import Link from "./components/Link";
import MajorHeading from "./components/MajorHeading";
import MinorHeading from "./components/MinorHeading";

export function AboutPage() {
  return (
    <>
      <div className="mt-12"></div>
      <div className="mt-8 flex flex-col items-center justify-center gap-6 md:mt-20">
        <code>
          <MajorHeading title="~ whoami" />
        </code>
        <AboutCard title="">
          <p>
            I&apos;d be glazing myself pretty hard if I wrote a whole section
            here explaining who I am. I&apos;d rather let you figure that out by
            exploring my <Link href={env.NEXT_PUBLIC_BLOG_URL} name="blog" />.
          </p>
        </AboutCard>
      </div>
      <div className="mt-10"></div>
      <MinorHeading title="" />
      <Footer />
      <div className="h-10"></div>
    </>
  );
}
