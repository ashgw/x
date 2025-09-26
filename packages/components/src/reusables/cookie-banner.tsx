"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, SurfaceCard, cn } from "@ashgw/ui";

interface Props {
  className?: string;
  storageKey?: string;
  title?: string;
  body?: string;
  acceptLabel?: string;
  rejectLabel?: string;
}

export function CookieBanner({
  className,
  storageKey = "privacy:cookie-consent",
  body = "I use cookies btw. So by being here, you accept cookies.",
  acceptLabel = "Accept",
  rejectLabel = "Reject",
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(storageKey);
    setOpen(v !== "accepted" && v !== "rejected");
  }, [storageKey]);

  const accept = useCallback(() => {
    localStorage.setItem(storageKey, "accepted");
    setOpen(false);
  }, [storageKey]);

  const reject = useCallback(() => {
    localStorage.setItem(storageKey, "rejected");
    setOpen(false);
  }, [storageKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.7 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className={cn("fixed bottom-6 right-6 z-50 max-w-[390px]", className)}
        >
          <SurfaceCard
            animation="none"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
          >
            <div className="text-semibold text-muted-foreground">{body}</div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={reject} className="text-xs">
                {rejectLabel}
              </Button>
              <Button onClick={accept} className="text-xs">
                {acceptLabel}
              </Button>
            </div>
          </SurfaceCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
