type Name = "Home" | "Blog" | "About";

interface NavLink {
  name: Name;
  href: string;
}

export const navLinks: readonly NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];
