'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

const useToggleDropDownMenu = ({
  menuId,
}: {
  menuId: string;
}): [boolean, () => void] => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleMenu: () => void = () => {
    setIsOpened(!isOpened);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!document.getElementById(menuId)?.contains(e.target as Node)) {
        setIsOpened(false);
      }
    };
    // @ts-expect-error it just works, no time to set types
    window.addEventListener('click', handleClickOutside);

    return () => {
      // @ts-expect-error it just works, no time to set types
      window.removeEventListener('click', handleClickOutside);
    };
  }, [menuId]);

  return [isOpened, toggleMenu];
};
export default useToggleDropDownMenu;
