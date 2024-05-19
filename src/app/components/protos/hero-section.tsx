/* eslint-disable */
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

import { Button } from '../ui/button';

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

/* eslint-disable */

function TypingAnimation() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'I <span class="glows">do</span> software',
        'And <span class="glows">rant</span> about it',
      ],
      typeSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="dimmed-4">
      <span ref={el} />
    </div>
  );
}

export default function HeroSection() {
  const TRANSITION_DURATION: number = 0.3; // secs
  const TRANSITION_DELAY: number = 0.4;
  const transition = {
    duration: TRANSITION_DURATION,
    delay: TRANSITION_DELAY,
  };
  return (
    <motion.section
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48"
    >
      <div className="container px-4 md:px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={transition}
            >
              <h1 className="text-5xl md:text-5xl lg:text-6xl/none xl:text-[5rem] font-bold tracking-tighter">
                <span className="dimmed-4">
                  Hey, I'm <span className="glows">AG</span>
                </span>
              </h1>
              <h1 className="text-5xl md:text-5xl lg:text-6xl/none xl:text-[5rem] font-bold tracking-tighter ">
                <TypingAnimation></TypingAnimation>
              </h1>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={transition}
            >
              <TextContent>
                Welcome to my corner of the internet where I share my thoughts
                and offer my expertise. You can read my blogs, checkout my
                services, or learn more about me, and if you like what you see
              </TextContent>
            </motion.div>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <motion.div
              className="grid gap-2"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                delay: 3,
              }}
            >
              <Button
                className="w-full glowsup"
                variant={'navbar'}
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                Let's build something great
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function TextContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
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
      className="p-2 my-1 mx-2 font-normal dimmed-3 max-w-[700px] "
    >
      {children}
    </motion.p>
  );
}
