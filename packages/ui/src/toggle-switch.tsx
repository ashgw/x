import React from "react";

import { cn } from "./cn";

interface ToggleSwitchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  leftButtonText: string;
  rightButtonText: string;
  isToggled: boolean;
  onToggle: (state: boolean) => void;
  className?: string;
}

export const ToggleSwitch = React.forwardRef<HTMLDivElement, ToggleSwitchProps>(
  (
    {
      leftButtonText,
      rightButtonText,
      isToggled,
      onToggle,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "turn-bg-gradient relative flex h-11 min-w-[200px] max-w-xl rounded-full border p-1 font-medium blur-medium",
          className,
        )}
        {...rest}
      >
        <div className="relative flex h-full w-full">
          <div
            className={cn(
              "absolute inset-0 m-[1px] w-1/2 rounded-full bg-foreground/20 transition-transform duration-300 ease-in-out",
              {
                "translate-x-0": !isToggled,
                "translate-x-full": isToggled,
              },
            )}
          />
          <button
            className={cn(
              "relative z-10 w-1/2 flex-1 px-4 text-center transition-colors duration-300",
              {
                "text-foreground": !isToggled,
                "text-muted-foreground": isToggled,
              },
            )}
            onClick={() => onToggle(false)}
          >
            {leftButtonText}
          </button>
          <button
            className={cn(
              "relative z-10 w-1/2 flex-1 px-4 text-center transition-colors duration-300",
              {
                "text-foreground": isToggled,
                "text-muted-foreground": !isToggled,
              },
            )}
            onClick={() => onToggle(true)}
          >
            {rightButtonText}
          </button>
        </div>
      </div>
    );
  },
);

ToggleSwitch.displayName = "ToggleSwitch";
