import Link from "next/link";

interface NavElementProps {
  name: string;
  href: string;
  onToggleMenu: () => void;
}

export function NavElement({ name, href, onToggleMenu }: NavElementProps) {
  return (
    <div className="average-transition hover:average-translate slower-transition rounded-3xl border border-white/10 shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)]">
      <Link
        href={href}
        className="dimmed-3 rounded-4xl block border-green-400 px-5 py-2 text-base hover:text-white"
        onClick={onToggleMenu}
      >
        {name}
      </Link>
    </div>
  );
}
