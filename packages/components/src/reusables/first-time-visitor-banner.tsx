"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "@ashgw/ui/motion";
import { Button, SurfaceCard, cn } from "@ashgw/design/ui";
import { useAnalytics } from "@ashgw/analytics/client";

type Stage = "cookie" | "themeInfo" | "done";

interface Props {
  className?: string;
}

function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs font-mono font-medium text-foreground shadow-sm relative -top-0.5",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function FirstTimeVisitorBanner({ className }: Props) {
  const analytics = useAnalytics();
  const [stage, setStage] = useState<Stage>("cookie");

  // Decide which stage to show on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookie = localStorage.getItem("privacy:cookie-consent");
    const themeInfo = localStorage.getItem("onboard:theme-info");

    if (!cookie) {
      setStage("cookie");
    } else if (!themeInfo) {
      setStage("themeInfo");
    } else {
      setStage("done");
    }
  }, []);

  // --- Handlers ---
  const acceptCookies = useCallback(() => {
    localStorage.setItem("privacy:cookie-consent", "accepted");
    analytics.opt_in_capturing();
    setStage("themeInfo");
  }, [analytics]);

  const rejectCookies = useCallback(() => {
    localStorage.setItem("privacy:cookie-consent", "rejected");
    analytics.opt_out_capturing();
    setStage("themeInfo");
  }, [analytics]);

  const completeThemeInfo = useCallback(() => {
    localStorage.setItem("onboard:theme-info", "done");
    setStage("done");
  }, []);

  let body: React.ReactNode = null;
  let buttons: React.ReactNode = null;

  if (stage === "cookie") {
    body = "I use cookies here. Just the usual stuff you already know.";
    buttons = (
      <>
        <Button variant="outline" onClick={rejectCookies} className="text-xs">
          Reject
        </Button>
        <Button onClick={acceptCookies} className="text-xs">
          Accept
        </Button>
      </>
    );
  } else if (stage === "themeInfo") {
    body = (
      <>
        One more thing though, we need to set up your theme. Press <Kbd>K</Kbd>
      </>
    );
    buttons = (
      <>
        <Button onClick={completeThemeInfo} className="text-xs">
          OK
        </Button>
      </>
    );
  }

  return (
    <AnimatePresence>
      {stage === "cookie" || stage === "themeInfo" ? (
        <motion.div
          key={stage} // makes it animate per stage
          initial={{ opacity: 0, y: 120, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 120, scale: 0.95 }}
          transition={{
            type: "tween",
            duration: 0.45,
            ease: "easeOut",
          }}
          className={cn("fixed bottom-6 right-6 z-50 max-w-[390px]", className)}
        >
          <SurfaceCard
            animation="ringGlowPulse"
            isBlur
            role="dialog"
            aria-live="polite"
            aria-label="First time visitor banner"
          >
            <div className="text-semibold text-dim-500">{body}</div>
            <div className="flex items-center justify-end gap-2">{buttons}</div>
          </SurfaceCard>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
