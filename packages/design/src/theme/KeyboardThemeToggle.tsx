"use client";

import * as React from "react";

/**
 * KeyboardThemeToggle
 * Hidden helper that toggles the `.red` theme class on the root element
 * when the user presses the "k" key. Returns null; no UI is rendered.
 */
export function KeyboardThemeToggle(): null {
  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      const root = document.documentElement;
      if (root.classList.contains("red")) {
        root.classList.remove("red");
      } else {
        root.classList.add("red");
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return null;
}
