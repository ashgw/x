'use client';
import { useRef } from 'react';
import LightGrid from '@/app/components/__futures__/light-grid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function App() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to('.box', { rotation: 180, duration: 2 });
    },
    { scope: container }
  );

  return (
    <div className="flex flex-col h-lvh w-auto items-center content-center space-x-9 ">
      <div ref={container} className="app">
        <div className="box">Hello</div>
      </div>
      <LightGrid />
    </div>
  );
}
