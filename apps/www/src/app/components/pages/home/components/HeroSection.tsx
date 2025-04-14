"use client";

import { motion } from "framer-motion";

import { Button } from "@ashgw/ui";

import { Text } from "./Text";
import { TypingAnimation } from "./TypingAnimation";

export function HeroSection() {
  const TRANSITION_DURATION = 0.3;
  const TRANSITION_DELAY = 0.4;
  const transition = {
    duration: TRANSITION_DURATION,
    delay: TRANSITION_DELAY,
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48"
    >
      <div className="container px-4 md:px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={transition}
            >
              <h1 className="text-5xl font-bold tracking-tighter md:text-5xl lg:text-6xl/none xl:text-[5rem]">
                <span className="dimmed-4">Digital Collection About</span>
              </h1>
              <h1 className="text-5xl font-bold tracking-tighter md:text-5xl lg:text-6xl/none xl:text-[5rem]">
                <TypingAnimation />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={transition}
            >
              <Text>
                Here I share insights from my professional and personal journey,
                serving as my brain dump for a thing or two I learned throughout
                the years.
              </Text>
            </motion.div>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <motion.div
              className="grid gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 3 }}
            >
              <Button
                className="glowsup w-full"
                variant="navbar"
                onClick={() => {
                  window.location.href = "/blog";
                }}
              >
                Read more
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
