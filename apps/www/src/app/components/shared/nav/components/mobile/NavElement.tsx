import Link from 'next/link';

interface NavElementProps {
  name: string;
  href: string;
  onToggleMenu: () => void;
}

export function NavElement({ name, href, onToggleMenu }: NavElementProps) {
  return (
    <div className="average-transition hover:average-translate rounded-3xl slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
      <Link
        href={href}
        className="dimmed-3 px-5 py-2 hover:text-white block rounded-4xl border-green-400 text-base"
        onClick={onToggleMenu}
      >
        {name}
      </Link>
    </div>
  );
}
