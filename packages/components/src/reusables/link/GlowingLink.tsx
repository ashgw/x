import { GlowingText } from "../text";
import { Link } from "./Link";

export const GlowingLink = ({ href, name }: { href: string; name: string }) => {
  return (
    <Link href={href}>
      <GlowingText>{name}</GlowingText>
    </Link>
  );
};
