import * as React from "react";

import { cn } from "./cn";

interface VariantProps {
  variant?: "default" | "rounded";
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & VariantProps
>(({ className, type, variant = "default", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "border-input bg-transparent ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variant === "rounded" && "rounded-full",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
