'use client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const LightGrid: React.FC = () => {
  const ref = useRef(null);
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to('dxd', {
        duration: 1,
        scale: 0.1,
        y: 40,
        ease: 'power1.inOut',
        stagger: {
          grid: [10, 10],
          from: 'center',
          amount: 1.5,
        },
      });
    },
    { scope: ref }
  );

  return (
    <>
      <div className=" flex justify-center items-center ">
        <div className="relative transition duration-1000 glowsup">
          <div ref={ref} className="dxd grid grid-cols-10 gap-4 ">
            {Array.from({ length: 100 }, (_, index) => (
              <div
                key={index}
                className=" bg-blue-500 flex items-center justify-center rounded-full"
              >
                <span className="h-[0.24rem] w-[0.24rem] bg-blue-500 rounded-full animate-ping "></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24 w-full"></div>
    </>
  );
};
export default LightGrid;
