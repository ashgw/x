import { ArrowUpRightSquare } from 'lucide-react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Image as _Image, Skeleton } from '@nextui-org/react';
import { Navbar } from '@/app/components/reusables/nav';
import { cn } from '@/lib/utils';
import NextLink from 'next/link';
import NextImage from 'next/image';
import CodeBlock from '@/app/components/reusables/code-block';
import React from 'react';

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{
        Code: CodeBlock,
        Nav: Navbar,
        Image: BlogImage,
        H: Heading,
        H2: Heading2,
        H3: Heading3,
        S: Spacer,
        S2: Spacer2,
        S3: Spacer3,
        C: Content,
        L: Link,
      }}
    ></_StyledMDX>
  );
}

type BlogImageProps = {
  alt: string;
  width: string;
  height: string;
  src: string;
  className?: string;
};
export function BlogImage(props: BlogImageProps) {
  return (
    <Skeleton className="flex items-center justify-center">
      <_Image
        isLoading
        isBlurred
        as={NextImage}
        className={cn('rounded-lg', props.className || '')}
        src={props.src}
        alt={props.alt}
        height={props.height}
        width={props.width}
      />
    </Skeleton>
  );
}

export function Link({
  href,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) {
  if (href.startsWith('#') || href.startsWith('/')) {
    return (
      <NextLink
        href={href}
        className="average-transition  font-bold text-fuchsia-400 hover:text-fuchsia-700"
        {...props}
      >
        {props.children}
      </NextLink>
    );
  }

  return (
    <NextLink
      href={href}
      className="average-transition font-bold text-pink-700 hover:text-pink-800 "
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {props.children}
      <ArrowUpRightSquare
        strokeWidth={'1.5px'}
        size={'20px'}
        style={{
          display: 'inline-block',
          marginLeft: '2px',
          marginBottom: '3px',
        }}
      />
    </NextLink>
  );
}

type HeaderProps = {
  children: React.ReactNode;
  id?: string;
};
export function Heading({ children, id }: HeaderProps) {
  return (
    <h1 id={id} className="font-bold my-2 text-[3.0rem]">
      {children}
    </h1>
  );
}
export function Heading2({ children, id }: HeaderProps) {
  return (
    <h2 id={id} className="text-3xl font-extrabold dimmed-5">
      {children}
    </h2>
  );
}
export function Heading3({ children, id }: HeaderProps) {
  return (
    <h3 id={id} className="text-2xl font-extrabold dimmed-4">
      {children}
    </h3>
  );
}

export function Content({ children }: { children: React.ReactNode }) {
  return <p className="p-2 mx-2 font-normal dimmed-3">{children}</p>;
}
export function Spacer({ children }: { children: React.ReactNode }) {
  return <div className="my-1">{children}</div>;
}
export function Spacer2({ children }: { children: React.ReactNode }) {
  return <div className="my-2">{children}</div>;
}
export function Spacer3({ children }: { children: React.ReactNode }) {
  return <div className="my-4">{children}</div>;
}

function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
