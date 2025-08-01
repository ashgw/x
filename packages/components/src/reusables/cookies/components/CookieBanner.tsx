"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { usePostHog } from "@ashgw/analytics/posthog-client";
import { Button } from "@ashgw/ui";

import "./CookieBanner.css";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const postHog = usePostHog();

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    postHog.opt_in_capturing();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="border-glow rounded-3xl border border-gray-700 bg-gray-800 bg-opacity-70 p-4 shadow-md backdrop-blur-md"
        >
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-300">
              <p>I use cookies btw. So by being here, you accept cookies.</p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleAccept}
                className="text-xs"
              >
                Ok, I got it
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
