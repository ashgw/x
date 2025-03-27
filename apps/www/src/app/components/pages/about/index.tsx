"use client";

import React from "react";

import { Footer } from "@ashgw/components";
import { LINKS, REPO_SOURCE } from "@ashgw/constants";
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
            exploring my <Link href={env.NEXT_PUBLIC_BLOG_URL} name="blog" />,
            since as I&apos;m guessing you&apos;re probably here because you saw
            me through something software related.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I do some open source from time to time, so feel free to check out
            my stuff on <Link inNewTab href={LINKS.npm} name="npm" />,{" "}
            <Link inNewTab href={LINKS.crates} name="crates" />, and{" "}
            <Link inNewTab href={LINKS.pypi} name="pypi" />. I also share a tiny
            bit of code publicly on <Link href={LINKS.gitHub} name="GitHub" />,
            mostly dev tools and niche libraries.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            Software-wise though, I need you to know a a couple of things about
            me. One, I&apos;m not a “backend developer” or “full-stack engineer”
            or “iOS” engineer, and I don&apos;t like to box myself into labels.
            If I don&apos;t know something, I&apos;ll learn it, easy as.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            Two, I don&apos;t stress about what some random library calls its
            methods, frameworks come and go. It&apos;s all the same to me, just
            pick the tool and keep it moving. So don't expect me to list a bunch
            of arbitrary tools that some guy created and call them "skills".
          </p>
        </AboutCard>{" "}
        <AboutCard title="">
          <p>
            Three, and the most important one yet, I&apos;ve been on Linux since
            like 12. Take a peek at my{" "}
            <Link href={LINKS.gitHub + "/dotfiles"} name="dotfiles" /> if you
            want to see how I run my setup.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            Now I&apos;ve built all kinds of stuff, web apps, mobile apps, hell
            even extensions, no-code and code automations, firmwares (yes
            firmwares), infra pipelines, LLMs and agent workflows, low-level
            RFCs and protocols …whatever. If it compiles or even if it
            doesn&apos;t, I&apos;ll figure it out.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            That&apos;s about it on software, but there&apos;s more to me than
            code. I&apos;m into psychology, philosophy, archaeology,
            anthropology, and history, probably 5 other obsessions I&apos;m
            forgetting right now. Maybe I&apos;ll spin up dedicated blog
            sections for each topic like I&apos;m doing here. Who knows.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            Oh, and there&apos;s a good chance I&apos;d beat you at poker,
            chess, or pool (especially poker). But hey, that&apos;s enough about
            me for now. The entire site is{" "}
            <Link href={REPO_SOURCE} name="open source" /> by the way, so feel
            free to rummage around. Peace out.
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
