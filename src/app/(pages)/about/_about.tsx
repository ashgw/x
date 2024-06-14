'use client';

import Footer from '@/app/components/footer/footer';
import { GlowingText } from '@/app/components/reusables/content';
import { REPO_SOURCE } from '@/lib/constants';
import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import React from 'react';
import { ReactNode } from 'react';

const ThisSiteTools = [
  'TypeScript',
  'ReactJS',
  'NextJS',
  'Framer-motion',
  'TailwindCSS',
  'MDX',
  'GitHub Actions',
  'Terraform',
  'AWS',
  'Playwright',
  'Jest',
  'Docker',
];

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
      }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
      className="border border-white/10 p-4 rounded-[2rem]"
    >
      <div className="flex flex-col gap-2 items-center text-xl">
        <div className=" text-center dimmed-3 max-w-[370px] sm:max-w-[550px] md:max-w-[650px] lg:max-w-[850px]">
          <h3 className=" glows-dimmed dimmed-4 text-2xl font-bold">{title}</h3>
          <div>{children}</div>
        </div>
      </div>
    </motion.div>
  );
};
export default function Page() {
  return (
    <>
      <div className="mt-12"></div>
      <div className="flex flex-col items-center justify-center gap-6 mt-8 md:mt-20">
        <code>
          <MajorHeading title="whoami" />
        </code>
        <Card title="">
          <p>
            I&apos;m a software developer, and I do work for
            <Link href="/contact" name="hire." />
          </p>
        </Card>
        <div className="hidden">
          <Card title="">
            <p>
              I&apos;ve been programming since I was 12 years old, getting
              professionally paid for it for 4 years now, where I&apos;ve had
              the privilge to collaborate with numerous individuals, teams and
              startups worldwide, to build, scale, and lead software projects.
            </p>
          </Card>
        </div>

        <Card title="">
          <p>
            You can learn more about me from my blogs than I can convey here.
            <br /> But in short, I believe in quality code, high-performing
            teams, and effective management
            <br /> And I do offer services aimed at enhancing these aspects for
            software teams.
          </p>
        </Card>
        <MajorHeading id="stack" title="Stack" />
        <Card title="">
          <p>
            I&apos;ve done it all, been there, done that, all the way from bare
            metal to frontend. As of now, I specialize primarily in
            object-oriented design and analysis in
            <Link href="/blog/tag/python" name="Python" /> and
            <Link href="/blog/tag/typescript" name="TypeScript" />, with a heavy
            focus on HTTP, microservices architecture, containerization, and
            cloud services (AWS).
          </p>
        </Card>
        <MajorHeading title={SITE_NAME || 'About The Website'} />
        <Card title="">
          <p>
            This site is open
            <Link href={REPO_SOURCE} name="source" /> and made using the
            following technologies for provisioning, development, testing, and
            deployment.
          </p>
        </Card>
        <Card title="">
          <div className="flex flex-wrap justify-center items-center gap-[0.625rem] text-sm dimmed-4">
            {ThisSiteTools.map((tech) => (
              <span
                key={tech}
                className="relative rounded-full px-2 py-1 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-10"></div>
      <MinorHeading title="" />
      <Footer></Footer>
    </>
  );
}

interface BaseHeadingProps {
  children: ReactNode;
  className?: string;
  id?: string;
}
const BaseHeading = (props: BaseHeadingProps) => {
  return (
    <motion.h2
      id={props.id}
      animate={{
        opacity: 1,
        x: 0,
      }}
      initial={{
        opacity: 0,
        x: -30,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className={cn(props.className)}
    >
      {props.children}
    </motion.h2>
  );
};

type HeadingProps = { title: string; id?: string };
const MinorHeading = ({ title, id }: HeadingProps) => {
  return (
    <BaseHeading id={id} className="glows-dimmed dimmed-4 text-1xl font-bold">
      {title}
    </BaseHeading>
  );
};

const MajorHeading = ({ title, id }: HeadingProps) => {
  return (
    <BaseHeading id={id} className=" glows-dimmed dimmed-4 text-2xl font-bold">
      {title}
    </BaseHeading>
  );
};

const Link = ({ href, name }: { href: string; name: string }) => {
  return (
    <NextLink href={href}>
      <GlowingText>{name}</GlowingText>
    </NextLink>
  );
};
