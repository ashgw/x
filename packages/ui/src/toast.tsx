"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "./cn";
import { cva } from "./cva";

// Toast types
type ToastType = "success" | "error" | "message";
type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

// Context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast variants - using outline styles like buttons
const toastVariants = cva(
  "relative flex w-full flex-col space-y-1 overflow-hidden rounded-2xl p-4 shadow-lg transition-all group select-none backdrop-blur-md bg-transparent",
  {
    variants: {
      type: {
        success:
          "border text-dim-300 border-border " +
          "hover:text-dim-400 hover:border-border/70 hover:bg-white/[0.03]",
        error:
          "border text-destructive border-destructive/40 " +
          "hover:text-destructive/80 hover:border-destructive/70 hover:bg-destructive/[0.08]",
        message:
          "border text-dim-300 border-border " +
          "hover:text-dim-400 hover:border-border/70 hover:bg-white/[0.03]",
      },
    },
    defaultVariants: {
      type: "message",
    },
  },
);

// Position variants for container
const positionVariants = cva("fixed z-50 flex flex-col space-y-3", {
  variants: {
    position: {
      "top-left": "top-6 left-6",
      "top-right": "top-6 right-6",
      "top-center": "top-6 left-1/2 -translate-x-1/2",
      "bottom-left": "bottom-6 left-6",
      "bottom-right": "bottom-6 right-6",
      "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    },
  },
  defaultVariants: {
    position: "top-right",
  },
});

// Animation variants based on position
const getAnimationVariants = (position: ToastPosition) => {
  const isTop = position.startsWith("top");
  const isCenter = position.includes("center");

  const initial = {
    opacity: 0,
    scale: 0.95,
    y: isTop ? -120 : 120,
    x: isCenter ? 0 : position.includes("right") ? 120 : -120,
  };

  const animate = {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
  };

  const exit = {
    opacity: 0,
    scale: 0.95,
    y: isTop ? -120 : 120,
    x: isCenter ? 0 : position.includes("right") ? 120 : -120,
  };

  return { initial, animate, exit };
};

// Toast component
interface ToastComponentProps {
  toast: Toast;
  position: ToastPosition;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, position, onRemove }: ToastComponentProps) {
  const { initial, animate, exit } = getAnimationVariants(position);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{
        type: "tween",
        duration: 0.4,
        ease: "easeOut",
      }}
      className="max-w-[400px] w-full"
      layout
    >
      <div className={cn(toastVariants({ type: toast.type }))}>
        {toast.title && (
          <div className="text-sm font-semibold leading-none tracking-tight">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
        {!toast.title && !toast.description && (
          <div className="text-sm">Toast message</div>
        )}
      </div>
    </motion.div>
  );
}

// Provider component
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({
  children,
  position = "top-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Listen for custom toast events
  React.useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      addToast(event.detail);
    };

    window.addEventListener("toast", handleToast as EventListener);
    return () => {
      window.removeEventListener("toast", handleToast as EventListener);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={cn(positionVariants({ position }))}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastComponent
              key={toast.id}
              toast={toast}
              position={position}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Toast function API (similar to Sonner)
export const toast = {
  success: (
    title: string,
    options?: { description?: string; duration?: number },
  ) => {
    if (typeof window === "undefined") return;
    const event = new CustomEvent("toast", {
      detail: { type: "success", title, ...options },
    });
    window.dispatchEvent(event);
  },

  error: (
    title: string,
    options?: { description?: string; duration?: number },
  ) => {
    if (typeof window === "undefined") return;
    const event = new CustomEvent("toast", {
      detail: { type: "error", title, ...options },
    });
    window.dispatchEvent(event);
  },

  message: (
    title: string,
    options?: { description?: string; duration?: number },
  ) => {
    if (typeof window === "undefined") return;
    const event = new CustomEvent("toast", {
      detail: { type: "message", title, ...options },
    });
    window.dispatchEvent(event);
  },
};
