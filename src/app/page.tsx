'use client';

import ThemeModeToggler from './components/reusables/theme-toggler';
import { Button } from './components/ui/button';

export default function Home() {
  return (
    <div className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
      <div className="flex items-center justify-center h-screen">
        <Button
          onClick={() => {
            window.location.href = '/blog';
          }}
        >
          Check out my blog
        </Button>
        <div className="px-5">
          <ThemeModeToggler></ThemeModeToggler>
        </div>
      </div>
    </div>
  );
}
