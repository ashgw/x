"use client";

import React from "react";
import { motion } from "framer-motion";

import type { HProps } from "./types";

export function H1({ children, id }: HProps) {
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
        ease: "easeInOut",
      }}
      id={id}
      className="my-2 text-[2.5rem] font-extrabold leading-10"
    >
      {children}
    </motion.h1>
  );
}
