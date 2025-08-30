"use client";

import NextLink from "next/link";

interface LinkProps {
  readonly href: string;
  readonly name: string;
  readonly inNewTab?: boolean;
}

const Link = ({ href, name, inNewTab = false }: LinkProps) => {
  return (
    <NextLink href={href} target={inNewTab ? "_blank" : undefined}>
      <span> </span>
      <strong className="glows text-white">{name}</strong>
      <span> </span>
    </NextLink>
  );
};

export default Link;
