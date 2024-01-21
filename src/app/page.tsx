'use client';

import ThemeModeToggler from '@/app/components/reusables/theme-toggler';
import { Button } from '@/app/components/ui/button';
import { Navbar } from '@/app/components/reusables/nav';

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
        <div className="flex items-center justify-center h-screen">
          <Button
            onClick={() => {
              window.location.href = '/blog';
            }}
          >
            Secret sauce
          </Button>
          <div className="px-5">
            <ThemeModeToggler></ThemeModeToggler>
          </div>
        </div>
      </div>
    </>
  );
}
