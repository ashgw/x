"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { logger } from "@ashgw/observability";

interface SoundContextType {
  isPlaying: boolean;
  toggleSound: () => void;
  setAudioSrc: (src: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
  children: ReactNode;
  initialAudioSrc?: string;
  initialPlayState?: boolean;
}

export function SoundProvider({
  children,
  initialAudioSrc = "",
  initialPlayState = false,
}: SoundProviderProps) {
  const [isPlaying, setIsPlaying] = useState(initialPlayState);
  const [audioSrc, setAudioSrc] = useState(initialAudioSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create audio element if not exists
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    // Update source if changed
    if (audioSrc && audioRef.current.src !== audioSrc) {
      audioRef.current.src = audioSrc;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  // Handle play state changes
  useEffect(() => {
    if (!audioRef.current || !audioSrc) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        logger.error("Audio playback failed", { error });
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioSrc]);

  const toggleSound = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const setAudioSource = useCallback((src: string) => {
    setAudioSrc(src);
  }, []);

  const value = {
    isPlaying,
    toggleSound,
    setAudioSrc: setAudioSource,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
