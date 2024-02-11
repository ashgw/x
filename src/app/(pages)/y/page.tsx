'use client';

import React from 'react';
import SourceCodeButton from '@/app/components/nav/buttons';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import HamburgerButton from '@/app/components/nav/hamburger';
import { useState } from 'react';

const Page: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleMenu = () => {
    setIsOpened(!isOpened);
  };
  return (
    <nav className="">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-2 flex items-center sm:hidden">
            <HamburgerButton isOpened={isOpened} onClick={toggleMenu} />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo />
            </div>
            <LeftNav />
          </div>
          <RightNav />
        </div>
      </div>
      <div className="average-transition scale-100">
        {isOpened ? <DropDownNav /> : null}
      </div>
    </nav>
  );
};

export default Page;
export function Logo() {
  return (
    <img
      className="h-8 w-auto"
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
      alt="Your Company"
    />
  );
}
export function LeftNav() {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        <a
          href="#"
          className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          aria-current="page"
        >
          Blog
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          About
        </a>
      </div>
    </div>
  );
}
export function RightNav() {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-3">
      <div className="average-transition hover:average-translate">
        <SourceCodeButton href="https://github.com/ashgw/mysite" />
      </div>
      <div className=" glowsup hidden sm:block">
        <Button className="w-full" variant={'navbarMin'}>
          Contact
        </Button>
      </div>
    </div>
  );
}

export function DropDownNav() {
  return (
    <div className="sm:hidden" id="mobile-menu">
      <div className="space-y-3 px-2 pb-3 pt-2">
        <div className="average-transition  hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
          <Link
            href="/blog"
            className="dimmed-3 px-5 py-2  hover:text-white block rounded-4xl border-green-400 text-base "
          >
            Blog
          </Link>
        </div>

        <div className="average-transition  hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
          <Link
            href="/about"
            className="dimmed-3  px-5 py-2 hover:text-white block rounded-4xl border-green-400 text-base"
          >
            About
          </Link>
        </div>
        <div className=" glowsup">
          <Button className="w-full" variant={'navbarMin'}>
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
