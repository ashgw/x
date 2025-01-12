'use client';

import { motion } from 'framer-motion';
import { CREATOR } from '~/lib/constants';

export function CopyRight() {
  return (
    <motion.div
      viewport={{ once: true }} // only run once per load
      whileInView={{
        opacity: 1,
      }}
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
      }}
    >
      <p className="flex items-center justify-center text-secondary-center dimmed-3 text-sm">
        &copy; {new Date().getFullYear()} {CREATOR}. All rights reserved
      </p>
    </motion.div>
  );
}
