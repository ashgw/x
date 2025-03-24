"use client";

import { motion } from "framer-motion";

import { cn } from "@ashgw/ui";

interface BaseHeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const BaseHeading = (props: BaseHeadingProps) => {
  return (
    <motion.h2
      id={props.id}
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
        ease: "easeInOut",
      }}
      className={cn(props.className)}
    >
      {props.children}
    </motion.h2>
  );
};

export default BaseHeading;
