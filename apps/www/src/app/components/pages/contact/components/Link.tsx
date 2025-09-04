"use client";

import NextLink from "next/link";

import { GlowingText } from "@ashgw/components";

interface LinkProps {
  readonly href: string;
  readonly name: string;
  readonly inNewTab?: boolean;
}
const Link = ({ href, name, inNewTab = false }: LinkProps) => {
  return (
    <NextLink href={href} target={inNewTab ? "_blank" : undefined}>
      <GlowingText>{name}</GlowingText>
    </NextLink>
  );
};

export default Link;
