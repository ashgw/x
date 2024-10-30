import { cn } from '@/lib/utils';
import React from 'react';

interface ToggleSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  leftButtonText: string;
  rightButtonText: string;
  isToggled: boolean;
  onToggle: (state: boolean) => void;
}

export const ToggleSwitch = React.forwardRef<HTMLDivElement, ToggleSwitchProps>(
  ({ leftButtonText, rightButtonText, isToggled, onToggle, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(
          'relative flex h-11 min-w-[200px] max-w-xl rounded-full border border-white/20 bg-white/10 backdrop-blur-md p-1 font-medium',
          rest.className
        )}
      >
        <div className="relative flex h-full w-full">
          <div
            className={cn(
              'bg-white/20 absolute inset-0 m-[1px] w-1/2 rounded-full transition-transform duration-300 ease-in-out',
              {
                'translate-x-0': !isToggled,
                'translate-x-full': isToggled,
              }
            )}
          />
          <button
            className={cn(
              'relative z-10 w-1/2 flex-1 px-4 text-center transition-colors duration-300',
              {
                'text-white': !isToggled,
                'text-gray-300': isToggled,
              }
            )}
            onClick={() => onToggle(false)}
          >
            {leftButtonText}
          </button>
          <button
            className={cn(
              'relative z-10 w-1/2 flex-1 px-4 text-center transition-colors duration-300',
              {
                'text-white': isToggled,
                'text-gray-300': !isToggled,
              }
            )}
            onClick={() => onToggle(true)}
          >
            {rightButtonText}
          </button>
        </div>
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';
