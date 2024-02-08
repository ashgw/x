import { GitBranch } from 'lucide-react';
import { Image as _Image } from '@nextui-org/react';
import NextLink from 'next/link';
import { Button } from '../ui/button';

export function OutLineButton({
  href,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={'outline'}
      className="hover:-translate-y-1 average-transition"
    >
      <NextLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {props.children}
        <GitBranch
          strokeWidth={'1.5px'}
          size={'20px'}
          style={{
            display: 'inline-block',
            marginLeft: '5px',
            marginBottom: '3px',
          }}
        />
      </NextLink>{' '}
    </Button>
  );
}
