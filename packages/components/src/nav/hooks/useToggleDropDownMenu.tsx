"use client";

import type { MouseEvent, TouchEvent } from "react";
import { useEffect, useState } from "react";

export function useToggleDropDownMenu(params: {
  menuId: string;
}): [boolean, () => void] {
  const initialState = false;
  const [isOpened, setIsOpened] = useState<boolean>(initialState);

  const toggleMenu: () => void = () => {
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!document.getElementById(params.menuId)?.contains(e.target as Node)) {
        setIsOpened(initialState);
      }
    };
    // @ts-expect-error it just works, no time to set types
    window.addEventListener("click", handleClickOutside);

    return () => {
      // @ts-expect-error it just works, no time to set types
      window.removeEventListener("click", handleClickOutside);
    };
  }, [params.menuId, initialState]);

  return [isOpened, toggleMenu];
}
