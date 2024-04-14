import NextLink from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Link({
  href,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) {
  const LINK_CLASS_NAME = cn(
    'average-transition',
    'gradient-text-purple',
    'hover:text-white'
  );
  if (href.startsWith('#')) {
    return (
      <NextLink href={href} className={cn(LINK_CLASS_NAME)} {...props}>
        {props.children}
      </NextLink>
    );
  }
  if (href.startsWith('/')) {
    return (
      <NextLink
        href={SITE_URL + href}
        className={cn(LINK_CLASS_NAME)}
        {...props}
      >
        {props.children}
      </NextLink>
    );
  }

  return (
    <NextLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(LINK_CLASS_NAME + 'hover: bright')}
      {...props}
    >
      {props.children}
      <span className="pl-1 hidden sm:inline-block">&#8599;</span>
    </NextLink>
  );
}
