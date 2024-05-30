'use client';

import SourceCodeButton from '@/app/components/nav/git-button';
import HamburgerButton from '@/app/components/nav/hamburger';
import { Button } from '@/app/components/ui/button';
import { REPO_SOURCE } from '@/lib/constants';
import useToggleDropDownMenu from '@/lib/hooks/useToggleDropDownMenu';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function NavBar() {
  const [isOpened, toggleMenu] = useToggleDropDownMenu({
    menuId: 'nav-menu',
  });
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (isOpened) {
      setOverlayVisible(true);
    } else {
      setOverlayVisible(false);
    }
  }, [isOpened]);

  const handleToggleMenu = () => {
    toggleMenu();
  };

  return (
    <nav id="nav-menu" className="pt-3 relative">
      <AnimatePresence>
        {isOverlayVisible && <BackgroundOverlay onClick={handleToggleMenu} />}
      </AnimatePresence>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div
            id="hamburger"
            className="absolute inset-y-0 left-2 flex items-center sm:hidden z-50"
          >
            <HamburgerButton isOpened={isOpened} onClick={handleToggleMenu} />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo />
            </div>
            <LeftNav />
          </div>
          <div className="z-50">
            <RightNav />
          </div>
        </div>
      </div>
      <div className="mx-2 sm:hidden">
        <AnimatePresence>
          {isOpened && <DropDownNav toggleMenu={handleToggleMenu} />}
        </AnimatePresence>
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
          className="nav-link-shadow dimmed-3 font-semibold average-transition hover:average-translate hover:text-white"
          href="/"
        >
          Home
        </Link>
        <Link
          className="nav-link-shadow dimmed-3 font-semibold average-transition hover:average-translate hover:text-white"
          href="/services"
        >
          Services
        </Link>
        <Link
          className="nav-link-shadow dimmed-3 font-semibold average-transition hover:average-translate hover:text-white"
          href="/blog"
        >
          Blog
        </Link>
        <Link
          className="nav-link-shadow dimmed-3 font-semibold average-transition hover:average-translate hover:text-white"
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
      <div className="average-transition hover:average-translate z-50">
        <SourceCodeButton href={REPO_SOURCE} />
      </div>
      <div className="glowsup hidden sm:block">
        <Link href="/contact">
          <Button className="w-full" variant={'navbar'}>
            Contact
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function DropDownNav({ toggleMenu }: { toggleMenu: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      exit={{ opacity: 0 }}
      className="absolute rounded-3xl z-50 backdrop-blur-2xl w-full space-y-3 px-5 pb-3 pt-2"
    >
      <SmallNavLink href="/" name="Home" toggleMenu={toggleMenu} />
      <SmallNavLink href="/services" name="Services" toggleMenu={toggleMenu} />
      <SmallNavLink href="/blog" name="Blog" toggleMenu={toggleMenu} />
      <SmallNavLink href="/about" name="About" toggleMenu={toggleMenu} />
      <div className="glowsup">
        <Link href="/contact">
          <Button className="w-full" variant={'navbar'} onClick={toggleMenu}>
            Contact
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

type SmallNavLinkProps = {
  name: string;
  href: string;
  toggleMenu: () => void;
};

function SmallNavLink({ name, href, toggleMenu }: SmallNavLinkProps) {
  return (
    <div className="average-transition hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
      <Link
        href={href}
        className="dimmed-3 px-5 py-2 hover:text-white block rounded-4xl border-green-400 text-base"
        onClick={toggleMenu}
      >
        {name}
      </Link>
    </div>
  );
}

function BackgroundOverlay({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-black sm:hidden"
      onClick={onClick}
    />
  );
}
