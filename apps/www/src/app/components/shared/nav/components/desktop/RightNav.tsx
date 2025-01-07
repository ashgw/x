import { Button } from '@ashgw/ui';
import Link from 'next/link';

import { navLinks } from '../../utils/navLinks';
import { RepoSourceCodeButton } from '../shared/RepoSourceCodeButton';

export function RightNav() {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-3">
      <div className="average-transition hover:average-translate z-50">
        <RepoSourceCodeButton />
      </div>
      <div className="glowsup hidden sm:block">
        {navLinks
          .filter(({ name }) => name === 'Contact')
          .map(({ name, href }) => (
            <Link key={name} href={href}>
              <Button className="w-full" variant={'navbar'}>
                {name}
              </Button>
            </Link>
          ))}
      </div>
    </div>
  );
}
