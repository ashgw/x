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
      components={{ Code: Code, Nav: Navbar, Image: StyledImage }}
    ></_StyledMDX>
  );
}

interface StyledImageProps {
  width: string;
  height: string;
  src: string;
  className?: string;
}

function StyledImage(p: StyledImageProps) {
  return (
    <Skeleton>
      <Image
        isLoading
        isBlurred
        as={NextImage}
        className={cn('rounded-lg', p.className || '')}
        src={p.src}
        alt="..."
        height={p.height}
        width={p.width}
      />
      ;
    </Skeleton>
  );
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
