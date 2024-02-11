import React from 'react';
import SourceCodeButton from '@/app/components/nav/buttons';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

const Page: React.FC = () => {
  return (
    <nav className="">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
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
          </div>
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
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-3 px-2 pb-3 pt-2">
          {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
          <div className="average-transition  hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
            <Link
              href="#"
              className="dimmed-3 px-5 py-2  hover:text-white block rounded-4xl border-green-400 text-base "
              aria-current="page"
            >
              Blog
            </Link>
          </div>

          <div className="average-transition  hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
            <Link
              href="#"
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
    </nav>
  );
};

export default Page;
