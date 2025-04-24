import { env } from "@ashgw/env";

type Name = "Home" | "Blog";

interface NavLink {
  name: Name;
  href: string;
}

export const navLinks: readonly NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Blog", href: env.NEXT_PUBLIC_BLOG_URL },
];
