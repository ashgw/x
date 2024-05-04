/* eslint-disable */
'use client';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import { useEffect, useRef } from 'react';

function TypingAnimation() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'I <solid class="gradient-text-purple">do</solid>  software',
        'I <solid class="gradient-text-purple">solve</solid> software',
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
      <div className="container px-4 md:px-6">
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
              <h1 className="xl:text-[5rem] font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <span className="dimmed-4">Hey, I'm Ashref</span>
              </h1>
              <h1 className="xl:text-[5rem] font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
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
                and conduct business. You can read my blogs or checkout my
                services, or learn more about me
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
              <Button type="submit">Let's build something great</Button>
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
