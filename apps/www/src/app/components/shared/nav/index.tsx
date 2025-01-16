"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import useToggleDropDownMenu from "../../../../lib/hooks/useToggleDropDownMenu";
import { LeftNav } from "./components/desktop/LeftNav";
import { RightNav } from "./components/desktop/RightNav";
import { BgOverlay } from "./components/mobile/BgOverlay";
import { DropDownMenu } from "./components/mobile/DropDownMenu";
import { HamburgerButton } from "./components/mobile/Hamburger";
import { Logo } from "./components/shared/Logo";

export function NavBar() {
  const [isOpened, toggleMenu] = useToggleDropDownMenu({
    menuId: "nav-menu",
  });
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    if (isOpened) {
      setIsOverlayVisible(true);
    } else {
      setIsOverlayVisible(false);
    }
  }, [isOpened]);

  const handleToggleMenu = () => {
    toggleMenu();
  };

  return (
    <nav id="nav-menu" className="relative pt-3">
      <AnimatePresence>
        {isOverlayVisible && <BgOverlay onClick={handleToggleMenu} />}
      </AnimatePresence>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div
            id="hamburger"
            className="absolute inset-y-0 left-2 z-50 flex items-center sm:hidden"
          >
            <HamburgerButton isOpened={isOpened} onClick={handleToggleMenu} />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Logo />
            </div>
            <LeftNav />
          </div>
          <div className="z-50">
            <RightNav />
          </div>
        </div>
      </div>
      <div className="mx-2 sm:hidden">
        <AnimatePresence>
          {isOpened && <DropDownMenu onToggleMenu={handleToggleMenu} />}
        </AnimatePresence>
      </div>
    </nav>
  );
}
