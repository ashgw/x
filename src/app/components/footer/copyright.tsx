'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
export default function CopyRight() {
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
        &copy; {new Date().getFullYear()} Ashref Gwader. All rights reserved
      </p>
      <div className="hidden dimmed-3 flex items-center justify-center gap-2 max-w-md mx-auto sm:gap-4">
        <Link
          className="dimmed-3 text-sm underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-50"
          href="#"
        >
          Terms
        </Link>
        <Link
          className="hidden text-sm underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-50"
          href="#"
        >
          Privacy
        </Link>
      </div>
    </motion.div>
  );
}
