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
      {navLinks
        .filter(({ hidden }) => !hidden)
        .map(({ name, href }) =>
          name === "Contact" ? (
            <Fragment key={name}>
              <div className="glowsup">
                <Link href={href}>
                  <Button
                    className="w-full"
                    variant={"navbar"}
                    onClick={onToggleMenu}
                  >
                    {name}
                  </Button>
                </Link>
              </div>
            </Fragment>
          ) : (
            <NavElement
              key={name}
              href={href}
              name={name}
              onToggleMenu={onToggleMenu}
            />
          ),
        )}
    </motion.div>
  );
}
