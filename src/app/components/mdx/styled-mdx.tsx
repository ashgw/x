import { ArrowUpRightSquare } from 'lucide-react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Image, Skeleton } from '@nextui-org/react';
import { Navbar } from '@/app/components/reusables/nav';
import { cn } from '@/lib/utils';
import NextLink from 'next/link';
import NextImage from 'next/image';
import CodeBlock from '@/app/components/reusables/syntax-highlighter';
import React from 'react';

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{
        Code: CodeBlock,
        Nav: Navbar,
        Image: StyledImage,
        H: Heading,
        H2: Heading2,
        H3: Heading3,
        S: Spacer,
        C: Content,
        L: Link,
      }}
    ></_StyledMDX>
  );
}

export function StyledImage(props: {
  alt: string;
  width: string;
  height: string;
  src: string;
  className?: string;
}) {
  return (
    <Skeleton className="flex items-center justify-center">
      <Image
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

function Link({ href, ...props }: { href: string; children: React.ReactNode }) {
  if (href.startsWith('#') || href.startsWith('/')) {
    return (
      <NextLink href={href} className=" font-bold text-fuchsia-400" {...props}>
        {props.children}
      </NextLink>
    );
  }

  return (
    <NextLink
      href={href}
      className=" font-bold text-pink-700"
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

export function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl font-bold my-5">{children}</h2>;
}
export function Heading2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold my-5">{children}</h2>;
}
export function Heading3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-bold my-2">{children}</h3>;
}

export function Content({ children }: { children: React.ReactNode }) {
  return <p className="row p-2 mx-2 font-normal ease-on-eye">{children}</p>;
}
export function Spacer({ children }: { children: React.ReactNode }) {
  return <div className="my-5">{children}</div>;
}

function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
