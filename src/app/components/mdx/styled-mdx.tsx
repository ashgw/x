import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Link } from '@/app/components/reusables/link';
import { Image, Skeleton } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import CodeBlock from '@/app/components/reusables/code-block';
import {
  Heading2,
  Heading3,
  Heading1,
} from '@/app/components/reusables/headers';
import { Spacer1, Spacer2, Spacer3 } from '@/app/components/reusables/spacers';
import { TextContent } from '@/app/components/reusables/content';

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{
        Code: CodeBlock,
        Image: MDXImage,
        H: Heading1,
        H2: Heading2,
        H3: Heading3,
        S: Spacer1,
        S2: Spacer2,
        S3: Spacer3,
        C: TextContent,
        L: Link,
      }}
    ></_StyledMDX>
  );
}
function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}

type MDXImageProps = {
  alt: string;
  width: string;
  height: string;
  src: string;
  className?: string;
};
export function MDXImage(props: MDXImageProps) {
  return (
    <Skeleton className="flex items-center justify-center">
      <Image
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
