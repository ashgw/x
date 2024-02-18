'use client';

import React from 'react';
import SourceCodeButton from '@/app/components/nav/git-button';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import HamburgerButton from '@/app/components/nav/hamburger';
import { motion, AnimatePresence } from 'framer-motion';
import useToggleDropDownMenu from '@/lib/hooks/useToggleDropDownMenue';

export default function NavBar() {
  const [isOpened, toggleMenu] = useToggleDropDownMenu({
    menuId: 'nav-menue',
  });

  return (
    <nav id="nav-menue" className="pt-3">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex h-16 items-center justify-between">
          <div
            id="hamburger"
            className="absolute inset-y-0 left-2 flex items-center sm:hidden"
          >
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
      <div className="mx-2 sm:hidden">
        <AnimatePresence>{isOpened && <DropDownNav />}</AnimatePresence>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Image
      width={25}
      height={25}
      src="https://avatars.githubusercontent.com/u/126174609?v=4"
      className="h-8 w-auto rounded-full invisible"
      alt="The logo"
    />
  );
}

export function LeftNav() {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-12">
        <Link
          className="nav-link-shadow dimmed-3 font-semibold average-transition  hover:average-translate  hover:text-white"
          href="/blog"
        >
          Blog
        </Link>
        <Link
          className="nav-link-shadow  dimmed-3 font-semibold average-transition  hover:average-translate hover:text-white"
          href="/books"
        >
          Books
        </Link>
        <Link
          className="nav-link-shadow  dimmed-3 font-semibold average-transition  hover:average-translate hover:text-white"
          href="/about"
        >
          About
        </Link>
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
        <Button className="w-full" variant={'navbar'}>
          Contact
        </Button>
      </div>
    </div>
  );
}

export function DropDownNav() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      exit={{
        opacity: 0,
      }}
      className="absolute rounded-3xl z-50 backdrop-blur-md  w-full space-y-3 px-5 pb-3 pt-2"
    >
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
          Books
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
    </motion.div>
  );
}
