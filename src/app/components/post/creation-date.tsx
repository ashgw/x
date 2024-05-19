'use client';

import { formatDate } from '@/lib/funcs/dates';
import { motion } from 'framer-motion';

export function CreationDate({ date }: { date: string }) {
  return (
    <motion.p
      animate={{
        opacity: 1,
        scale: 1,
      }}
      initial={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
      className="text-sm dimmed-0"
    >
      {formatDate(date)}
    </motion.p>
  );
}
