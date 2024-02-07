'use client';

import ThemeModeToggler from '@/app/components/reusables/theme-toggler';
import CopyRight from '@/app/components/footer/copyright';
import { Button } from '@/app/components/ui/button';
import Nav from '@/app/components/nav/nav';
import { Badge } from '@/app/components/ui/badge';

export default function Home() {
  return (
    <>
      <Nav></Nav>
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
          <br></br>
          <Badge variant="success">New</Badge>
        </div>
      </div>
      <CopyRight></CopyRight>
    </>
  );
}
