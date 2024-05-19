'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

export const ThreeTrafficLightsMovingObjects: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
      tl.to('.x', {
        rotation: 360,
        duration: 2,
        borderRadius: 16,
        translateX: -150,
        ease: 'power1.inOut',
      });
      tl.to('.x', {
        rotation: -360,
        duration: 2,
        borderRadius: 0,
        translateX: 150,
        ease: 'power1.inOut',
      });
      tl.to('.x', {
        rotation: 360,
        duration: 2,
        borderRadius: 16,
        translateX: 0,
        ease: 'power1.inOut',
      });
    },
    { scope: container, dependencies: [] }
  );
  return (
    <div>
      <div
        ref={container}
        className="flex flex-col items-center justify-center gap-10"
      >
        <div className="x w-10 h-10 bg-red-400 rounded-2xl animate-pulse  "></div>
        <div className="x w-10 h-10 bg-yellow-400 rounded-2xl animate-pulse "></div>
        <div className="x w-10 h-10 bg-green-500 rounded-2xl animate-pulse "></div>
      </div>
    </div>
  );
};
