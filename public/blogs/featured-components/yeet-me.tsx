'use client';

import { motion } from 'framer-motion';

export default function YeetMe() {
  return (
    <div className="flex justify-center items-center py-2">
      <YeetButton />
    </div>
  );
}

export function YeetButton() {
  const initial = {
    opacity: 0,
    borderRadius: 0,
    scale: 0,
    rotate: 360,
  };
  const animate = {
    opacity: 1,
    width: 160,
    height: 70,
    borderRadius: 20,
    scale: 1,
    boxShadow: '10px 10px 0 rgba(255, 46, 199, 0.2)',
    rotate: 0,
  };
  const transition = {
    duration: 1,
    type: 'keyframes',
    ease: 'easeInOut',
  };
  const whileHover = {
    cursor: 'grab',
  };
  const whileDrag = {
    cursor: 'grabbing',
  };
  return (
    <motion.button
      layout
      viewport={{ once: true }}
      className="flex justify-center items-center origin-center bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 w-80 h-80"
      initial={initial}
      whileInView={animate}
      transition={transition}
      whileHover={whileHover}
      drag
      whileDrag={whileDrag}
      dragConstraints={{
        top: -10,
        left: -10,
        right: 10,
        bottom: 10,
      }}
      dragMomentum={true}
      dragPropagation
    >
      <motion.div
        layout
        viewport={{ once: true }}
        className="flex justify-center items-center origin-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-80 h-80"
        initial={initial}
        whileInView={animate}
        transition={transition}
        whileHover={whileHover}
        whileDrag={whileDrag}
        drag
      >
        <span className=" font-bold">yeet me</span>
      </motion.div>
    </motion.button>
  );
}
