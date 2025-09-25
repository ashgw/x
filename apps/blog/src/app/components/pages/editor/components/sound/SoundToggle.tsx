"use client";

import { motion } from "framer-motion";
import { useSound } from "./SoundContext";

export function SoundToggle() {
  const { isPlaying, toggleSound, isLoading } = useSound();

  return (
    <motion.button
      aria-label={
        isLoading ? "Loading sound" : `Turn sound ${isPlaying ? "off" : "on"}`
      }
      aria-pressed={isPlaying}
      onClick={toggleSound}
      className="border fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 "
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      disabled={isLoading}
    >
      {/* icon */}
      <motion.div
        className="relative h-5 w-5"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: isLoading ? 0.55 : isPlaying ? 1 : 0.75 }}
        transition={{ duration: 0.15 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isPlaying ? "opacity-100" : "opacity-60"}
          />
        </svg>

        {!isPlaying ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-[1.5px] w-full rotate-45 transform rounded-full bg-white/90" />
          </motion.div>
        ) : null}
      </motion.div>

      {/* label */}
      <div className="flex flex-col justify-center">
        <motion.span
          className="text-xs font-medium uppercase tracking-wider"
          animate={{ opacity: isLoading ? 0.5 : isPlaying ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {isLoading ? "LOADING..." : `SOUND ${isPlaying ? "ON" : "OFF"}`}
        </motion.span>
      </div>
    </motion.button>
  );
}
