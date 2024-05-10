'use client';
import { PUBLIC_BLOG_IMAGES_SOURCE } from '@/lib/constants';
import Footer from '@/app/components/footer/footer';
import { motion } from 'framer-motion';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React, { Suspense } from 'react';
import { SITE_NAME } from '@/lib/constants';
import { GlowingText } from '@/app/components/reusables/content';
import NextLink from 'next/link';
import { ReactNode } from 'react';

const FrontEnd = [
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
        <div className=" text-center dimmed-3 max-w-sm sm:max-w-[550px] md:max-w-[650px] lg:max-w-[850px]">
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
      <motion.div
        animate={{
          opacity: 1,
          x: 0,
        }}
        initial={{
          opacity: 0,
          x: 20,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        className="mx-auto w-full px-5 max-w-[1065px] brightness-90"
      >
        <Suspense fallback={<Skeleton />}>
          <div className="relative">
            <img
              className="rounded-3xl"
              alt="niko"
              src={PUBLIC_BLOG_IMAGES_SOURCE + 'winston-wolf.png'}
            />
            <div className="absolute bottom-4 left-4 text-white opacity-40 font-bold text-sm">
              Pulp Fiction (1994) by Quentin Tarantino
            </div>
          </div>
        </Suspense>
      </motion.div>
      <div className="flex flex-col items-center justify-center my-7 md:mt-20">
        <motion.h2
          viewport={{ once: true }} // only run once per load
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          className="text-center italic text-2xl md:text-3xl font-bold dimmed-4"
        >
          - &quot;Hi, I&apos;m Winston Wolf, I solve problems&quot;
        </motion.h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 mt-8 md:mt-20">
        <Card title="">
          <p>
            I&apos;m a software developer and technical educator, and I do work
            for hire. <br />
            Over the past 7 years I&apos;ve had the privilge to collaborate with
            numerous individuals, teams and startups worldwide, to build, scale,
            and lead software projects.
          </p>
        </Card>
        <Card title="">
          <p>
            You can learn more about me from my blogs than I can convey here.
            <br /> I believe in
            <Link href="/blog/tag/quality" name="quality" /> code,
            <Link href="/blog/tag/skill-issues" name="high-performing" />
            teams, and effective
            <Link href="/blog/tag/management" name="management" />. And my
            services are aimed at enhancing these aspects for my clients.
          </p>
        </Card>
        <MajorHeading title="Stack" />
        <Card title="">
          <p>
            While I have experience with many technologies, I specialize and
            work mostly in Python and TypeScript, with a heavy focus on
            everything web related (HTTP, RPC, GraphQL, microservices,
            containers, cloud architecture...)
          </p>
        </Card>
        <MinorHeading title="A wise man once said" />
        <Card title="">
          <p>
            <span className="italic">
              &quot;Before you learn an ephemeral web framework, learn HTTP
              instead, that way you have learned every web framework to ever
              exist&quot;
            </span>
          </p>
        </Card>
        <Card title="">
          <p>
            Frameworks and libraries don&apos;t matter they come and go.
            Fundamentals are key. But if you&apos;re interested in knowing the
            exact tools I use you can check out my
            <Link href="/blog/tag/management" name="cv" /> (it&apos;s too long),
            or, you might want to check out my
            <Link href="/blog/tag/management" name="resume" /> to get a glimpse
            instead. Speaking of tools
          </p>
        </Card>
        <MajorHeading title="About The Website" />
        <Card title="">
          <p>
            <code>{SITE_NAME}</code> is open{' '}
            <Link href="/blog/tag/management" name="source" /> and made with the
            following technologies and a sprinkle of creativity
          </p>
        </Card>
        <Card title="">
          <div className="flex flex-wrap justify-center items-center gap-[0.625rem] text-sm dimmed-4">
            {FrontEnd.map((tech) => (
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
const MinorHeading = ({ title }: { title: string }) => {
  return (
    <BaseHeading className="glows-dimmed dimmed-4 text-1xl font-bold">
      {title}
    </BaseHeading>
  );
};

const MajorHeading = ({ title }: { title: string }) => {
  return (
    <BaseHeading className=" glows-dimmed dimmed-4 text-2xl font-bold">
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
