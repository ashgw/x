"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "@ashgw/design/motion";
import { Button, SurfaceCard, cn } from "@ashgw/design/ui";
import { useAnalytics } from "@ashgw/analytics/client";

type Stage = "cookie" | "kWait" | "done";

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
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cookie = localStorage.getItem("privacy:cookie-consent");
    const themeInfo = localStorage.getItem("onboard:theme-info");

    if (!cookie) {
      setStage("cookie");
      setConsent(null);
    } else if (themeInfo !== "done") {
      setStage("kWait");
      setConsent(cookie === "accepted" ? "accepted" : "rejected");
    } else {
      setStage("done");
      setConsent(cookie === "accepted" ? "accepted" : "rejected");
    }
  }, []);

  useEffect(() => {
    if (stage !== "kWait") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k") {
        localStorage.setItem("onboard:theme-info", "done");
        setStage("done");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  const acceptCookies = useCallback(() => {
    localStorage.setItem("privacy:cookie-consent", "accepted");
    analytics.opt_in_capturing();
    setConsent("accepted");
    setStage("kWait");
  }, [analytics]);

  const rejectCookies = useCallback(() => {
    localStorage.setItem("privacy:cookie-consent", "rejected");
    analytics.opt_out_capturing();
    setConsent("rejected");
    setStage("kWait");
  }, [analytics]);

  const cookieBody = "New here? Got to let you know, I use cookies";

  const kWaitBody =
    consent === "accepted" ? (
      <>
        Great, press <Kbd>K</Kbd> to switch themes
      </>
    ) : (
      <>
        Anyways, press <Kbd>K</Kbd> to switch themes
      </>
    );

  const show = stage === "cookie" || stage === "kWait";

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 120, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 0.95 }}
          exit={{ opacity: 0, y: 120, scale: 0.7 }}
          transition={{ type: "tween", duration: 0.45, ease: "easeOut" }}
          className={cn("fixed bottom-6 right-6 z-50 max-w-[390px]", className)}
        >
          <SurfaceCard
            animation="ringGlowPulse"
            isBlur
            role="dialog"
            aria-live="polite"
            aria-label="First-time visitor banner"
          >
            <div className="text-semibold text-dim-400">
              {stage === "cookie" ? cookieBody : kWaitBody}
            </div>

            <div className="flex items-center justify-end gap-2">
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
