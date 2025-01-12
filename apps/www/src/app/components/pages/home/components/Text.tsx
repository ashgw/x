import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export function Text({ children }: PropsWithChildren<NonNullable<unknown>>) {
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
