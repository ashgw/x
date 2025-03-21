import React from "react";

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export function MobileNav({ isOpen, toggleMenu }: MobileNavProps) {
  return (
    <button
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="z-50 block sm:hidden"
      onClick={toggleMenu}
    >
      <div className={`hamburger-menu ${isOpen ? "open" : ""}`}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </button>
  );
}
