import { ArrowUpRightSquare } from 'lucide-react';
import { Image as _Image } from '@nextui-org/react';
import NextLink from 'next/link';

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
