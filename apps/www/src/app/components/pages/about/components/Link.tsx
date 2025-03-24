"use client";

import NextLink from "next/link";

import { GlowingText } from "@ashgw/components";

const Link = ({ href, name }: { href: string; name: string }) => {
  return (
    <NextLink href={href}>
      <GlowingText>{name}</GlowingText>
    </NextLink>
  );
};

export default Link;
