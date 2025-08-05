"use client";

import type { ReactNode } from "react";
import type { MaybeUndefined, Optional } from "ts-roids";
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
  isLoading: boolean;
}

const SoundContext = createContext<MaybeUndefined<SoundContextType>>(undefined);

interface SoundProviderProps {
  children: ReactNode;
  audioPath?: string;
  initialPlayState?: boolean;
}

export function SoundProvider({
  children,
  audioPath = "/audio/focus_sound.wav",
  initialPlayState = false,
}: SoundProviderProps) {
  const [isPlaying, setIsPlaying] = useState(initialPlayState);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<Optional<HTMLAudioElement>>(null);
  // Store event handlers in refs to keep them across re-renders
  const handleCanPlayThroughRef = useRef<() => void>(() => setIsLoading(false));
  const handleErrorRef = useRef<(e: Event) => void>((e) => {
    logger.error("Audio loading error", { error: e });
    setIsLoading(false);
  });

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);

      // Create audio element if not exists
      if (!audioRef.current) {
        audioRef.current = new Audio(audioPath);
        audioRef.current.loop = true; // Ensure audio loops infinitely

        // Add event listeners
        audioRef.current.addEventListener(
          "canplaythrough",
          handleCanPlayThroughRef.current,
        );
        audioRef.current.addEventListener("error", handleErrorRef.current);
      }
    } catch (error) {
      logger.error("Failed to initialize audio", { error });
      setIsLoading(false);
    }

    return () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        // Remove event listeners
        audio.removeEventListener(
          "canplaythrough",
          handleCanPlayThroughRef.current,
        );
        audio.removeEventListener("error", handleErrorRef.current);
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [audioPath]);

  // Handle play state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();

      // Handle play promise to catch autoplay blocking
      playPromise.catch((error) => {
        logger.error("Audio playback failed", { error });
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggleSound = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const value = {
    isPlaying,
    toggleSound,
    isLoading,
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
