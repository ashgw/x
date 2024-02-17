'use client';
import { useRef } from 'react';
import LightGrid from '@/app/components/__futures__/light-grid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to('.box', {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'expo',
      });
    },
    { scope: container }
  );

  return (
    <div className="flex flex-col h-lvh w-auto items-center content-center space-x-9 ">
      <div ref={container} className="app">
        <div className="box">Hello</div>
      </div>
      <div className="py-10 w-auto"></div>
      <LightGrid />
      <NextArticle />
    </div>
  );
}

function NextArticle() {
  return (
    <>
      <button
        className="flex flex-row space-x-9  items-center justify-center"
        onClick={() => {
          console.log(window.location.href);
        }}
      >
        <div className="slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] average-transition border rounded-[2rem] hover:scale-125  p-2 border-white/10">
          <ChevronLeft className="dimmed-5" />
        </div>
        <div className="transition-all duration-500 shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] average-transition border rounded-[2rem] p-2 hover:scale-125  border-white/10">
          <ChevronRight className="dimmed-5" />
        </div>
      </button>
    </>
  );
}
