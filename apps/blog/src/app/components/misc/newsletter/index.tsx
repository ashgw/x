"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

import { sentry } from "@ashgw/observability";
import { Button } from "@ashgw/ui";

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // swap this for your real API
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Success!", {
        description: "Thank you for subscribing.",
      });

      setEmail("");
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later",
      });

      sentry.next.captureException({
        error,
        withErrorLogging: {
          message: "Failed to subscribe to newsletter",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={`mx-auto w-full max-w-[1280px] px-2 sm:px-10 ${className ?? ""}`}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="slower-transition mx-auto flex max-w-[600px] flex-col items-center rounded-[2rem] border border-white/10 p-8 shadow">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[480px] items-center justify-center gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="h-12 flex-1 rounded-[2rem] border border-white/15 bg-white/5 px-3 text-sm font-medium text-[#B0B0B0] focus:border-white/30 focus:outline-none"
          />

          <Button
            className="glowsup shrink-0"
            variant="navbarMin"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "…" : "Subscribe"}
          </Button>
        </form>

        <p className="dimmed-3 mt-4 text-center text-sm">
          Extension of this blog and my Twitter. Weekly updates.
        </p>
      </div>
      <Toaster position="bottom-right" />
    </motion.div>
  );
}
