import { Image, Skeleton } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';

type MDXImageProps = {
  alt?: string;
  fill?: boolean;
  className?: string;
  src: string;
};
export function MDXImage(props: MDXImageProps) {
  return (
    <Skeleton className="flex items-center justify-center brightness-50">
      <Image
        as={NextImage}
        className={cn('rounded-lg', props.className || '')}
        src={props.src}
        alt={props.alt || 'blog image'}
        fill={props.fill || true}
      />
    </Skeleton>
  );
}
