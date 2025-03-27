"use client";

import { motion } from "framer-motion";

import { DateService } from "@ashgw/cross-runtime";

export function ReleaseDate({ date }: { date: string }) {
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
        ease: "easeOut",
      }}
      className="dimmed-0 text-sm"
    >
      {DateService.formatDate({ stringDate: date })}
    </motion.p>
  );
}
