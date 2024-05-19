'use client';

import { Skeleton } from '@/app/components/ui/skeleton';
import { PUBLIC_BLOG_IMAGES_SOURCE } from '@/lib/constants';
import { motion } from 'framer-motion';
import React, { Suspense } from 'react';

const PulpFictionRef = () => {
  return (
    <>
      <motion.div
        animate={{
          opacity: 1,
          x: 0,
        }}
        initial={{
          opacity: 0,
          x: 20,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        className="mx-auto w-full px-5 max-w-[1065px] brightness-90"
      >
        <Suspense fallback={<Skeleton />}>
          <div className="relative">
            <img
              className="rounded-3xl"
              alt="niko"
              src={PUBLIC_BLOG_IMAGES_SOURCE + 'winston-wolf.png'}
            />
            <div className="absolute bottom-4 left-4 text-white opacity-40 font-bold text-sm">
              Pulp Fiction (1994) by Quentin Tarantino
            </div>
          </div>
        </Suspense>
      </motion.div>
      <div className="flex flex-col items-center justify-center my-7 md:mt-20">
        <motion.h2
          viewport={{ once: true }} // only run once per load
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          className="text-center italic text-2xl md:text-3xl font-bold dimmed-4"
        >
          - &quot;Hi, I&apos;m Winston Wolf, I solve problems&quot;
        </motion.h2>
      </div>
    </>
  );
};

export default PulpFictionRef;
