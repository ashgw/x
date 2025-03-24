"use client";

import { motion } from "framer-motion";

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
}

const AboutCard: React.FC<CardProps> = ({ title, children }) => {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
      }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
      className="rounded-[2rem] border border-white/10 p-4"
    >
      <div className="flex flex-col items-center gap-2 text-xl">
        <div className="dimmed-3 max-w-[370px] text-center sm:max-w-[550px] md:max-w-[650px] lg:max-w-[850px]">
          <h3 className="glows-dimmed dimmed-4 text-2xl font-bold">{title}</h3>
          <div>{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutCard;
