'use client';
import React from 'react';
import { motion } from 'framer-motion';

export type HeadingProps = {
  children: React.ReactNode;
  id?: string;
};

export function Heading1({ children, id }: HeadingProps) {
  return (
    <motion.h1
      animate={{
        opacity: 1,
        y: 0,
      }}
      initial={{
        opacity: 0,
        y: -30,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      id={id}
      className=" leading-10 font-extrabold my-2 text-[2.5rem]"
    >
      {children}
    </motion.h1>
  );
}
export function Heading2({ children, id }: HeadingProps) {
  return (
    <motion.h2
      animate={{
        opacity: 1,
        x: 0,
      }}
      initial={{
        opacity: 0,
        x: -30,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      id={id}
      className="text-3xl font-bold dimmed-4"
    >
      {children}
    </motion.h2>
  );
}
export function Heading3({ children, id }: HeadingProps) {
  return (
    <motion.h3
      animate={{
        opacity: 1,
        x: 0,
      }}
      initial={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      id={id}
      className="text-2xl font-bold dimmed-4"
    >
      {children}
    </motion.h3>
  );
}
