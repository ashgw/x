import { Fragment } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@ashgw/ui";

import { navLinks } from "../../utils/navLinks";
import { NavElement } from "./NavElement";

interface DropDownMenuProps {
  onToggleMenu: () => void;
}

export function DropDownMenu({ onToggleMenu }: DropDownMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0 }}
      className="absolute z-50 w-full space-y-3 rounded-3xl px-5 pb-3 pt-2 backdrop-blur-2xl"
    >
      {navLinks.map(({ name, href }) => (
        <NavElement
          key={name}
          href={href}
          name={name}
          onToggleMenu={onToggleMenu}
        />
      ))}
      <Fragment>
        <div className="glowsup">
          <Link href="/contact">
            <Button className="w-full" variant="navbar" onClick={onToggleMenu}>
              Contact
            </Button>
          </Link>
        </div>
      </Fragment>
    </motion.div>
  );
}
