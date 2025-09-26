"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, SurfaceCard, cn } from "@ashgw/ui";
import { useAnalytics } from "@ashgw/analytics/client";

interface Props {
  className?: string;
  storageKey?: string;
  body?: string;
  acceptLabel?: string;
  rejectLabel?: string;
}

export function CookieBanner({
  className,
  storageKey = "privacy:cookie-consent",
  body = "I use cookies here. Just the usual stuff you already know",
  acceptLabel = "Accept",
  rejectLabel = "Reject",
}: Props) {
  const [open, setOpen] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(storageKey);

    if (v === "accepted") {
      analytics.opt_in_capturing();
    } else if (v === "rejected") {
      analytics.opt_out_capturing();
    } else {
      setOpen(true);
    }
  }, [analytics, storageKey]);

  const accept = useCallback(() => {
    localStorage.setItem(storageKey, "accepted");
    analytics.opt_in_capturing();
    setOpen(false);
  }, [analytics, storageKey]);

  const reject = useCallback(() => {
    localStorage.setItem(storageKey, "rejected");
    analytics.opt_out_capturing();
    setOpen(false);
  }, [analytics, storageKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 120, scale: 0.95 }}
          transition={{
            type: "tween",
            duration: 0.45,
            ease: "easeOut", // built-in, no need for custom bezier
          }}
          className={cn("fixed bottom-6 right-6 z-50 max-w-[390px]", className)}
        >
          <SurfaceCard
            animation="ringGlowPulse"
            isBlur
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
          >
            <div className="text-semibold text-dim-500">{body}</div>
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
