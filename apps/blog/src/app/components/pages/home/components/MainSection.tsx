"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { H1, TextContent } from "@ashgw/components";

const AnimatedCounter = ({
  target,
  duration = 2,
}: {
  target: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(target * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span className="font-bold text-white">{count}</span>;
};

const BlogIntro: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto my-20 max-w-2xl"
    >
      <div className="rounded-3xl border border-white/10 bg-gray-800/30 p-8 backdrop-blur-md">
        <div className="space-y-6 text-center">
          <H1>Welcome, Alek!</H1>

          <div className="space-y-4">
            <TextContent>
              I maintain two blogs. My software development blog, where I've
              written <AnimatedCounter target={122} /> articles over the years,
              sharing insights and experiences from my journey in tech.
            </TextContent>

            <TextContent>
              Recently, I've started a health-focused blog with{" "}
              <AnimatedCounter target={1} /> article, exploring various aspects
              of well-being and fitness.
            </TextContent>

            <TextContent>
              Stay tuned - there might be more coming soon!
            </TextContent>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function MainSection() {
  return (
    <div className="container px-4">
      <BlogIntro />
    </div>
  );
}
