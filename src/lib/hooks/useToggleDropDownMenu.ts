'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

const useToggleDropDownMenu = ({
  menuId,
}: {
  menuId: string;
}): [boolean, () => void] => {
  const initialState = false;
  const [isOpened, setIsOpened] = useState<boolean>(initialState);

  const toggleMenu: () => void = () => {
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!document.getElementById(menuId)?.contains(e.target as Node)) {
        setIsOpened(initialState);
      }
    };
    // @ts-expect-error it just works, no time to set types
    window.addEventListener('click', handleClickOutside);

    return () => {
      // @ts-expect-error it just works, no time to set types
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menuId, initialState]);

  return [isOpened, toggleMenu];
};
export default useToggleDropDownMenu;
