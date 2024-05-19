import { GitBranch } from 'lucide-react';
import NextLink from 'next/link';

import { Button } from '../ui/button';

export default function SourceCodeButton({ href }: { href: string }) {
  return (
    <Button variant={'outline'}>
      <NextLink href={href} target="_blank" rel="noopener noreferrer">
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
