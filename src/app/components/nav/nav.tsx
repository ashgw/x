import { Button } from '../ui/button';

import Link from 'next/link';

import clsx from 'clsx';

const Nav = () => {
  return (
    <nav className="mx-auto flex h-[5.5rem] w-full max-w-[1344px] items-center px-5 sm:px-10">
      <div
        className={clsx(
          'absolute left-0 top-[4.375rem] z-20 h-[calc(100vh-4.375rem)] w-full overflow-y-auto bg-[#E9E9E9] p-5 dark:bg-black sm:px-10 xl:static xl:ml-10 xl:flex xl:h-auto xl:items-center xl:overflow-y-visible xl:bg-transparent xl:p-0 xl:dark:bg-transparent'
        )}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:gap-8">
          <Link
            className="nav-link-shadow transition-all dark:hover:text-white"
            href="/"
          >
            Home
          </Link>
          <Link
            className="nav-link-shadow transition-all dark:hover:text-white"
            href="/blog"
          >
            Blog
          </Link>

          <Link
            className="nav-link-shadow transition-all dark:hover:text-white"
            href="/About"
          >
            About
          </Link>
        </div>
        <div className="mt-10 xl:ml-auto xl:mt-0 xl:flex xl:items-center xl:gap-5">
          <div className="mt-10 flex flex-wrap items-center gap-5 xl:mt-0">
            <Button variant={'outline'}>
              <Link href={'https://github.com/ashgw/mysite'}>
                Edit on GitHub
              </Link>
            </Button>
            <div>
              <Button> Business</Button>
            </div>
          </div>
        </div>
      </div>

      <button className="ml-auto dark:text-[#D8D8D8] xl:hidden"></button>
    </nav>
  );
};

export default Nav;
