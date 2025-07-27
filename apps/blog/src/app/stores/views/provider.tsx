import type { ReactNode } from "react";

interface ViewsProviderProps {
  children: ReactNode;
}

export function ViewsProvider({ children }: ViewsProviderProps) {
  return children;
}
