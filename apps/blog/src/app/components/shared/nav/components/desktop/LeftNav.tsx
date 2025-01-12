import Link from "next/link";

import { navLinks } from "../../utils/navLinks";

export function LeftNav() {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-12">
        {navLinks
          .filter(({ hidden }) => !hidden) // Some are not neeeded rn, hide em
          .map(({ name, href }) => (
            <Link
              key={name}
              className="nav-link-shadow dimmed-3 average-transition hover:average-translate font-semibold hover:text-white"
              href={href}
            >
              {name}
            </Link>
          ))}
      </div>
    </div>
  );
}
