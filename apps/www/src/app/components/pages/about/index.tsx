"use client";

import React from "react";

import { Footer } from "@ashgw/components";
import { LINKS, REPO_SOURCE } from "@ashgw/constants";

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
            here telling you who I am. I&apos;d rather let you figure that out
            by poking around my <Link href={"/blog"} name="blog" />, projects,
            or random musings. But since you&apos;re here, I&apos;m guessing you
            saw me through something related to software.
          </p>
        </AboutCard>

        <AboutCard title="">
          <p>
            I do open source sometimes—feel free to check out my stuff on{" "}
            <Link href={LINKS.npm} name="npm" />,{" "}
            <Link href={LINKS.crates} name="crates" />, and{" "}
            <Link href={LINKS.pypi} name="pypi" />. I also share a bit of code
            publicly on GitHub—mostly dev tools and random libraries.
          </p>
        </AboutCard>

        <AboutCard title="">
          <p>
            Software-wise, I&apos;ve built just about everything: encryption
            libraries, text editors in C, typed-libs in TypeScript, Python stuff
            for all kinds of tasks, web apps, Android/iOS apps, GitHub Apps,
            containers…both low-level and high-level. Basically, if it
            compiles—or even if it doesn&apos;t—I&apos;ve probably messed around
            with it.
          </p>
        </AboutCard>

        <AboutCard title="">
          <p>
            But trust me, there&apos;s more to me than just writing code. I have
            about 10k songs memorized in my head, and I&apos;m just as deep into
            philosophy, archaeology, anthropology, and history. Fun fact: I also
            speak three languages (complete with proper accents—they come
            included in the package).
          </p>
        </AboutCard>

        <AboutCard title="">
          <p>
            College was too slow for me, so I dropped out. Lecture after
            lecture, I kept thinking I could learn faster on my own—so I
            bounced. This isn&apos;t a fancy portfolio site, by the way.
            I&apos;m not that type, and if you came looking for a tidy CV, that
            won&apos;t happen here.
          </p>
        </AboutCard>

        <AboutCard title="">
          <p>
            Oh, and there&apos;s a high chance I&apos;d beat you at poker,
            chess, or even pool (especially poker). But hey, that&apos;s enough
            about me for now. Feel free to keep exploring—this entire site is{" "}
            <Link href={REPO_SOURCE} name="open source" />. Peace out.
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
