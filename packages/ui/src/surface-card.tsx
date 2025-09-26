import * as React from "react";
import type { VariantProps } from "@ashgw/ui";
import { cva } from "./cva";
import { cn } from "./cn";

const surfaceCardVariants = cva(
  "group flex flex-col border shadow transition-all select-none",
  {
    variants: {
      size: {
        default: "p-5 rounded-[2rem]",
        sm: "p-3 rounded-xl",
        lg: "p-8 rounded-[2.5rem]",
      },
      animation: {
        none: "",
        scale: "hover:scale-105 duration-200",
        pop: "hover:scale-110 duration-200",
        glow: "glow-500 hover:shadow-[0px_4px_88px_0px_var(--glow-accent-strong)]",
        glowScale:
          "glow-500 hover:scale-105 hover:shadow-[0px_4px_88px_0px_var(--glow-accent-strong)] duration-200",
      },
    },
    defaultVariants: {
      size: "default",
      animation: "glowScale",
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceCardVariants> {
  asChild?: boolean;
}

export const SurfaceCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "section" : "div";
    return (
      <Comp
        ref={ref}
        className={cn(surfaceCardVariants({ size, animation }), className)}
        {...props}
      />
    );
  },
);
SurfaceCard.displayName = "SurfaceCard";
