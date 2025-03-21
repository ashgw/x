"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCopyToClipboard } from "react-use";
import { toast, Toaster } from "sonner";

import { Footer, H1, TextContent } from "@ashgw/components";
import {
  BOOKING_LINK,
  EMAIL,
  GPG_PUBLIC_KEY_INTERNAL_URL,
  LINKS,
} from "@ashgw/constants";
import { ToggleSwitch } from "@ashgw/ui";

export function ContactPage() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);

  async function copyGPG() {
    const res = await fetch(GPG_PUBLIC_KEY_INTERNAL_URL, {
      method: "GET",
    });
    if (!res.ok) {
      const failureMessage = await res.text();
      toast.message("Oops! Looks like something went wrong!", {
        description: failureMessage,
      });
    }
    const key = await res.text();
    copyToClipboard(key);
    toast.message("79821E0224D34EC4969FF6A8E5168EE090AE80D0", {
      description: "PGP public key block is copied to your clipboard",
    });
  }

  const handleToggle = (state: boolean) => {
    setIsToggled(state);
    if (state) {
      window.location.href = BOOKING_LINK;
    } else {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="mt-20 w-full py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <H1>
                  <span className="">Get in touch</span>
                </H1>
                <div className="mx-auto max-w-[600px]">
                  <TextContent>
                    I use{" "}
                    <button
                      onClick={async () => {
                        await copyGPG();
                      }}
                    >
                      <strong className="glows text-white underline">
                        GPG
                      </strong>
                    </button>
                    for secure communication. Feel free to use it for encrypted
                    messages and to verify my
                    <GlowingLink href={LINKS.keyBase} name="identity." />
                    Other than that, you can
                  </TextContent>
                </div>
              </div>
              <div className="mx-auto max-w-sm space-y-4">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  <ToggleSwitch
                    leftButtonText="Email Me"
                    rightButtonText="Book a Call"
                    isToggled={isToggled}
                    onToggle={handleToggle}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
