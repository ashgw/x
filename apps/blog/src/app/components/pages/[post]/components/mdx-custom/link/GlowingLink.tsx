import { GlowingText } from "@ashgw/components";

import { BlogLink } from "./Link";

export const GlowingBlogLink = ({
  href,
  name,
}: {
  href: string;
  name: string;
}) => {
  return (
    <BlogLink href={href}>
      <GlowingText>{name}</GlowingText>
    </BlogLink>
  );
};
