"use client";

import type { ReactNode } from "react";
import type { Optional } from "ts-roids";
import { createContext, useContext, useMemo } from "react";

import { RootStore } from "./root-store";

const StoreContext = createContext<Optional<RootStore>>(null);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Create store instance on client side
  const store = useMemo(() => new RootStore(), []);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): { store: RootStore } {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return { store };
}
