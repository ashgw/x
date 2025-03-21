"use client";

import { cn } from "@ashgw/ui";

export const GlowingText: React.FC<React.HTMLProps<HTMLSpanElement>> = (
  props,
) => {
  const { className, children, ...otherProps } = props;
  return (
    <>
      <span> </span>
      <strong className={cn("glows text-white", className)} {...otherProps}>
        {children}
      </strong>
      <span> </span>
    </>
  );
};
