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
            here explaining who I am. I&apos;d rather you figure that out by
            exploring my <Link href={env.NEXT_PUBLIC_BLOG_URL} name="blog" />,
            open source repos, or clicking around at random. But since
            you&apos;re here, I&apos;m guessing you saw me through something
            software-related.
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
            Software-wise, I&apos;m not a “backend developer” or “full-stack
            engineer” or “iOS” engineer, and I don&apos;t like to box myself
            into labels. If I don&apos;t know something, I&apos;ll learn it,
            easy as.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I&apos;ve been on Linux since I was 12. Take a peek at my{" "}
            <Link href={LINKS.gitHub + "/dotfiles"} name="dotfiles" /> if you
            want to see how I run my setup. I don&apos;t stress about what some
            random library calls its methods, frameworks come and go. It&apos;s
            all the same to me, just pick the tool and keep it moving.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I&apos;ve built all kinds of stuff: web apps, mobile apps, heck even
            GitHub Apps, no-code and code automations, firmwares (yes
            firmwares), infra pipelines, LLM and agent integrations workflows,
            low-level RFCs and protocols …whatever. If it compiles or even if it
            doesn&apos;t, I&apos;ll figure it out. The only thing I recall now
            working on is blockchain, and I probably won&apos;t pursue{" "}
            <Link
              inNewTab
              href={
                "https://www.reddit.com/r/memecoins/comments/1heta78/yeah_im_finna_bridge/"
              }
              name="that"
            />{" "}
            any time soon
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
            College was too slow for me, so I started skipping. Then they said,
            “You can&apos;t pass if you don&apos;t show up,” so I dropped out.
            ROI wasn&apos;t there anyway. I learn 10x faster on my own. So no,
            this isn&apos;t a fancy CV or &quot;portfolio&quot; showcasing what
            a great &quot;employee&quot; I am. I&apos;m not that type, and I
            don&apos;t use CVs.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            Oh, and there&apos;s a good chance I&apos;d beat you at poker,
            chess, or pool (especially poker).{" "}
            <Link href={LINKS.twitter.link} name="hmu rn" />. But hey,
            that&apos;s enough about me for now. The entire site is{" "}
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
