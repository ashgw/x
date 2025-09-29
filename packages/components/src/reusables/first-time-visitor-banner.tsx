"use client";

import { useEffect, useState } from "react";
import { Banner, cn } from "@ashgw/design/ui";
import { useAnalytics } from "@ashgw/analytics/client";

type Stage = "init" | "kWait" | "lWait" | "dWait" | "final" | "done";

interface Props {
  className?: string;
}

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

  // Always enable analytics
  useEffect(() => {
    // If your SDK persists this flag, calling once is fine
    analytics.opt_in_capturing();
  }, [analytics]);

  const [stage, setStage] = useState<Stage>(() => {
    if (typeof window === "undefined") return "init";
    const flow = localStorage.getItem(LS_FLOW);
    const legacy = localStorage.getItem(LS_THEME_INFO);
    if (flow === "completed" || legacy === "done") return "done";
    return "kWait";
  });

  // Key handling
  useEffect(() => {
    if (stage === "done" || stage === "init") return;

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

  const show =
    stage === "kWait" ||
    stage === "lWait" ||
    stage === "dWait" ||
    stage === "final";
  if (!show) return null;

  return (
    <Banner
      open
      position="bottom-right"
      instanceKey={stage}
      className={className}
      durationMs={320}
      role="dialog"
      ariaLabel="Theme onboarding"
    >
      <div className="text-semibold text-dim-400">
        {stage === "kWait" ? (
          <>
            Press <Kbd>K</Kbd> to cycle through dark themes.
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

      <div className="mt-3 flex items-center justify-end gap-2" />
    </Banner>
  );
}
