"use client";

import type { ReactNode } from "react";
import type { Thing, WithContext } from "schema-dts";

export type JsonLdBuilder = () => WithContext<Thing>;

export interface JsonLdProviderProps {
  entries:
    | JsonLdBuilder
    | WithContext<Thing>
    | (JsonLdBuilder | WithContext<Thing>)[];
  children: ReactNode;
}

/**
 * Renders multiple JSON-LD <script> tags and wraps children.
 * Supports both functions and plain objects.
 */
export const JsonLdScriptProvider = ({
  entries,
  children,
}: JsonLdProviderProps) => {
  const normalized = Array.isArray(entries) ? entries : [entries];

  return (
    <>
      {normalized.map((entry, i) => {
        const json = typeof entry === "function" ? entry() : entry;
        return (
          <script key={i} type="application/ld+json">
            {JSON.stringify(json)}
          </script>
        );
      })}
      {children}
    </>
  );
};
