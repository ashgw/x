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
        className=" average-transition gradient-text-purple hover:text-white"
        {...props}
      >
        {props.children}
      </NextLink>
    );
  }

  return (
    <NextLink
      href={href}
      className="average-transition gradient-text-purple hover:text-white hover:bright "
      {...props}
    >
      {props.children}
      <span className="pl-1 ">&#x2197;</span>
    </NextLink>
  );
}
