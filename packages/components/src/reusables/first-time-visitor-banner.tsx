"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "@ashgw/design/motion";
import { Button, SurfaceCard, cn } from "@ashgw/design/ui";
import { useAnalytics } from "@ashgw/analytics/client";

type Stage = "cookie" | "kWait" | "lWait" | "dWait" | "final" | "done";
type Consent = "accepted" | "rejected" | null;

interface Props {
  className?: string;
}

const LS_COOKIE = "privacy:cookie-consent";
const LS_FLOW = "onboard:theme-flow"; // "completed" when fully done
const LS_THEME_INFO = "onboard:theme-info"; // keep writing "done" for back-compat

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
        "inline-flex items-center justify-center rounded-md border border-border bg-surface px-1.5 py-0.5 text-xs font-mono font-medium shadow-sm relative -top-0.5",
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
  const [consent, setConsent] = useState<Consent>(null);

  // Initialize from storage (and respect old key)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookie = localStorage.getItem(LS_COOKIE) as Consent | null;
    const flow = localStorage.getItem(LS_FLOW);
    const legacy = localStorage.getItem(LS_THEME_INFO);

    if (flow === "completed" || legacy === "done") {
      setConsent(
        cookie === "accepted"
          ? "accepted"
          : cookie === "rejected"
            ? "rejected"
            : null,
      );
      setStage("done");
      return;
    }

    if (!cookie) {
      setConsent(null);
      setStage("cookie");
    } else {
      setConsent(cookie);
      setStage("kWait");
    }
  }, []);

  // Handle key presses per stage
  useEffect(() => {
    if (stage === "cookie" || stage === "done") return;

    function handleKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const key = e.key.toLowerCase();

      if (stage === "kWait" && key === "k") {
        // User cycled dark themes; now tease light mode
        setStage("lWait");
        return;
      }

      if (stage === "lWait" && key === "l") {
        // User went light, now nudge back to dark
        setStage("dWait");
        return;
      }

      if (stage === "dWait" && key === "d") {
        // Back to comfy dark, show final message
        setStage("final");
        return;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stage]);

  // Final auto-dismiss + persist completion
  useEffect(() => {
    if (stage !== "final") return;
    // Mark flow complete (and legacy key for older checks)
    localStorage.setItem(LS_FLOW, "completed");
    localStorage.setItem(LS_THEME_INFO, "done");

    const t = setTimeout(() => {
      setStage("done");
    }, 3000);
    return () => clearTimeout(t);
  }, [stage]);

  const acceptCookies = useCallback(() => {
    localStorage.setItem(LS_COOKIE, "accepted");
    analytics.opt_in_capturing();
    setConsent("accepted");
    setStage("kWait");
  }, [analytics]);

  const rejectCookies = useCallback(() => {
    localStorage.setItem(LS_COOKIE, "rejected");
    analytics.opt_out_capturing();
    setConsent("rejected");
    setStage("kWait");
  }, [analytics]);

  const body =
    stage === "cookie" ? (
      <>New here? I use cookies for analytics. Your data stays private.</>
    ) : stage === "kWait" ? (
      <>
        {consent === "accepted" ? "Nice." : "Cool."} Press <Kbd>K</Kbd> to flip
        through the dark themes. Your eyes will thank you.
      </>
    ) : stage === "lWait" ? (
      <>
        If you prefer light mode, press <Kbd>L</Kbd> to switch.
      </>
    ) : stage === "dWait" ? (
      <>
        Press <Kbd>D</Kbd> to return to dark.
      </>
    ) : (
      <>All set. Enjoy!</>
    );

  const show =
    stage === "cookie" ||
    stage === "kWait" ||
    stage === "lWait" ||
    stage === "dWait" ||
    stage === "final";

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 120, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 0.95 }}
          exit={{ opacity: 0, y: 120, scale: 0.7 }}
          transition={{ type: "tween", duration: 0.45, ease: "easeOut" }}
          className={cn("fixed bottom-6 right-6 z-50 max-w-[420px]", className)}
        >
          <SurfaceCard
            animation="ringGlowPulse"
            isBlur
            role="dialog"
            aria-live="polite"
            aria-label="First-time visitor banner"
          >
            <div className="text-semibold text-dim-400">{body}</div>

            <div className="mt-3 flex items-center justify-end gap-2">
              {stage === "cookie" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={rejectCookies}
                    className="text-xs"
                  >
                    Reject
                  </Button>
                  <Button onClick={acceptCookies} className="text-xs">
                    Accept
                  </Button>
                </>
              ) : null}
            </div>
          </SurfaceCard>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
