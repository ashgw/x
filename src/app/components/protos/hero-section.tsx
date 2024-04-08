/* eslint-disable */
'use client';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Hey, I'm Ashref
            </h1>
            <TextContent>
              Welcome to my corner of the internet where I share my thoughts and
              conduct my business by building solutions to complex problems.
            </TextContent>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="grid gap-2">
              <Button type="submit">Let's work together</Button>
            </form>
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
