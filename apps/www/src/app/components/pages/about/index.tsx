"use client";

import React from "react";

import { Footer } from "@ashgw/components";
import { LINKS, REPO_SOURCE, SITE_NAME } from "@ashgw/constants";

import AboutCard from "./components/AboutCard";
import Link from "./components/Link";
import MajorHeading from "./components/MajorHeading";
import MinorHeading from "./components/MinorHeading";

const ThisSiteTools = [
  "TypeScript",
  "ReactJS",
  "Figma",
  "NextJS",
  "Framer-motion",
  "TailwindCSS",
  "MDX",
  "GitHub Actions",
  "Terraform",
  "AWS",
  "Playwright",
  "Jest",
  "Docker",
];

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
            I&apos;m a poker player, and a retired chess player, anthropology
            aficionado, cinema enthusiast, and software engineer.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I&apos;ve been programming since, well as far as I can remember,
            getting professionally paid for it for the last 5 years now, where
            I&apos;ve had the privilege to collaborate with numerous
            individuals, teams and startups worldwide, to build, scale, and lead
            software projects.
          </p>
        </AboutCard>
        <div className="hidden">
          <MajorHeading id="stack" title="Stack" />
        </div>
        <AboutCard title="">
          <p>
            I&apos;ve done it all, been there, done that, all the way from bare
            metal to frontend
            <br />
            (this site is open
            <Link href={REPO_SOURCE} name="source" /> btw). <br />
            As of now, I mostly enjoy and work with TypeScript, Docker and AWS.
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I also do some open source from time to time, where you can find me
            publishing libraries on <br />
            <Link href={LINKS.npm} name="npm" />,
            <Link href={LINKS.crates} name="crates" /> and
            <Link href={LINKS.pypi} name="pypi" />
          </p>
        </AboutCard>
        <AboutCard title="">
          <p>
            I am currently <Link href={"/services"} name="open" />
            to engaging in selective consulting contracts and project
            partnerships. If you&apos;re looking to scale SaaS products, or
            enhance your team capabilities,
            <br />
            <Link href={"/contact"} name="let's talk." />
          </p>
        </AboutCard>

        <div id="about-this-site" className="hidden">
          <MajorHeading title={SITE_NAME} />
          <AboutCard title="">
            <p>
              This site is open
              <Link href={REPO_SOURCE} name="source," /> and made using the
              following technologies for prototyping, provisioning, development,
              testing, and deployment.
            </p>
          </AboutCard>
          <AboutCard title="">
            <div className="dimmed-4 flex flex-wrap items-center justify-center gap-[0.625rem] text-sm">
              {ThisSiteTools.map((tech) => (
                <span
                  key={tech}
                  className="relative rounded-full border border-white/10 px-2 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AboutCard>
        </div>
      </div>
      <div className="mt-10"></div>
      <MinorHeading title="" />
      <Footer></Footer>
      <div className="h-10"></div>
    </>
  );
}
