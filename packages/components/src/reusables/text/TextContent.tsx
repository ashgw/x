"use client";

import { motion } from "framer-motion";

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
        ease: "easeInOut",
      }}
      className="dimmed-3 mx-2 my-1 p-2 font-normal"
    >
      {children}
    </motion.p>
  );
}
