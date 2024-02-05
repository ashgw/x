import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { Image, Skeleton } from '@nextui-org/react';
import { Navbar } from '@/app/components/reusables/nav';
import { cn } from '@/lib/utils';
import { highlight } from 'sugar-high';
import NextImage from 'next/image';

export default function StyledMDX({ source }: { source: string }) {
  return (
    <_StyledMDX
      source={source}
      components={{
        Code: Code,
        Nav: Navbar,
        Image: StyledImage,
        H: Heading,
        S: Spacer,
      }}
    ></_StyledMDX>
  );
}

interface StyledImageProps {
  width: string;
  height: string;
  src: string;
  className?: string;
}

function StyledImage(props: StyledImageProps) {
  return (
    <Skeleton className="flex items-center justify-center">
      <Image
        isLoading
        isBlurred
        as={NextImage}
        className={cn('rounded-lg', props.className || '')}
        src={props.src}
        alt="..."
        height={props.height}
        width={props.width}
      />
    </Skeleton>
  );
}

export async function Heading({ children }: { children: React.ReactNode }) {
  return <div className="text-4xl font-bold">{children}</div>;
}
export async function Spacer({ children }: { children: React.ReactNode }) {
  return <div className="my-5">{children}</div>;
}

export const Code: React.FC<{
  children: string;
}> = ({ children, ...props }) => {
  return (
    <code
      dangerouslySetInnerHTML={{ __html: highlight(children) }}
      {...props}
    />
  );
};

function _StyledMDX({ components, ...props }: MDXRemoteProps) {
  return <MDXRemote {...props} components={{ ...components }} />;
}
