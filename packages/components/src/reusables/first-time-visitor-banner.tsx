"use client";

import { useEffect, useState, useCallback } from "react";
import { Banner, Button, cn } from "@ashgw/design/ui";
import { useAnalytics } from "@ashgw/analytics/client";

type Stage = "init" | "cookie" | "kWait" | "lWait" | "dWait" | "final" | "done";
type Consent = "accepted" | "rejected" | null;

interface Props {
  className?: string;
}

const LS_COOKIE = "privacy:cookie-consent";
const LS_FLOW = "onboard:theme-flow";
const LS_THEME_INFO = "onboard:theme-info";

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
        "relative -top-0.5 inline-flex items-center justify-center rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-xs font-medium shadow-sm",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function FirstTimeVisitorBanner({ className }: Props) {
  const analytics = useAnalytics();

  // Synchronous initial read, avoids first-frame "cookie" render
  const [consent, setConsent] = useState<Consent>(() => {
    if (typeof window === "undefined") return null;
    const c = localStorage.getItem(LS_COOKIE) as Consent | null;
    return c === "accepted" ? "accepted" : c === "rejected" ? "rejected" : null;
  });

  const [stage, setStage] = useState<Stage>(() => {
    if (typeof window === "undefined") return "init";
    const flow = localStorage.getItem(LS_FLOW);
    const legacy = localStorage.getItem(LS_THEME_INFO);
    if (flow === "completed" || legacy === "done") return "done";
    const c = localStorage.getItem(LS_COOKIE) as Consent | null;
    return c ? "kWait" : "cookie";
  });

  // Key handling
  useEffect(() => {
    if (stage === "cookie" || stage === "done" || stage === "init") return;

    function handleKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const key = e.key.toLowerCase();

      if (stage === "kWait" && key === "k") setStage("lWait");
      else if (stage === "lWait" && key === "l") setStage("dWait");
      else if (stage === "dWait" && key === "d") setStage("final");
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stage]);

  // Final auto-dismiss + persist completion
  useEffect(() => {
    if (stage !== "final") return;
    localStorage.setItem(LS_FLOW, "completed");
    localStorage.setItem(LS_THEME_INFO, "done");
    const t = setTimeout(() => setStage("done"), 3000);
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

  const show =
    stage === "cookie" ||
    stage === "kWait" ||
    stage === "lWait" ||
    stage === "dWait" ||
    stage === "final";

  // Do not mount the Banner at all unless we intend to show it
  if (!show) return null;

  return (
    <Banner
      open
      position="bottom-right"
      instanceKey={stage}
      className={className}
      durationMs={320}
      role="dialog"
      ariaLabel="First-time visitor banner"
    >
      <div className="text-semibold text-dim-400">
        {stage === "cookie" ? (
          <>New here? I use cookies for analytics. Your data stays private.</>
        ) : stage === "kWait" ? (
          <>
            {consent === "accepted" ? "Noted." : "Understood."} Press{" "}
            <Kbd>K</Kbd> to cycle through dark themes.
          </>
        ) : stage === "lWait" ? (
          <>
            Prefer light? Press <Kbd>L</Kbd> to switch.
          </>
        ) : stage === "dWait" ? (
          <>
            Press <Kbd>D</Kbd> to return to dark.
          </>
        ) : (
          <>All set. Enjoy!</>
        )}
      </div>

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
    </Banner>
  );
}
