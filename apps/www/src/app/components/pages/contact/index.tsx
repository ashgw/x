"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCopyToClipboard } from "react-use";
import { toast, Toaster } from "sonner";

import { Footer, TextContent } from "@ashgw/components";
import { EMAIL, LINKS } from "@ashgw/constants";
import { sentry } from "@ashgw/observability";
import { ToggleSwitch } from "@ashgw/ui";

import Link from "../about/components/Link";
import { CalBooking } from "./components/CalBooking";

export function ContactPage() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  const generateObfuscatedEmail = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = EMAIL.length + Math.floor(Math.random() * 5);

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result
      .split("")
      .map((char, index) => {
        if (index % 3 === 0) {
          return `<span style="display:none">bot@trap.com</span>${char}`;
        } else if (index % 5 === 0) {
          return `${char}<span aria-hidden="true">&#8203;</span>`;
        }
        return char;
      })
      .join("");
  };

  const obfuscatedEmailHTML = generateObfuscatedEmail();

  function revealEmail(e: React.MouseEvent) {
    e.preventDefault();
    setEmailRevealed(true);
    // smol delay to allow user to see the real email before redirecting
    setTimeout(() => {
      window.location.href = `mailto:${EMAIL}`;
    }, 500);
  }

  async function copyGPG() {
    try {
      const res = await fetch("/api/v1/gpg", {
        method: "GET",
      });
      if (!res.ok) {
        const failureMessage = await res.text();
        throw new Error(failureMessage);
      }
      const key = await res.text();
      copyToClipboard(key);
      toast.message("79821E0224D34EC4969FF6A8E5168EE090AE80D0", {
        description: "PGP public key block is copied to your clipboard",
      });
    } catch (error) {
      toast.message(
        sentry.next.captureException({
          error,
          message: "Oops! Looks like something went wrong!",
        }),
      );
    }
  }

  const handleToggle = (state: boolean) => {
    setIsToggled(state);
    if (state) {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
      if (emailRevealed) {
        window.location.href = `mailto:${EMAIL}`;
      } else {
        setEmailRevealed(true);
        setTimeout(() => {
          window.location.href = `mailto:${EMAIL}`;
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="mt-20 w-full py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <motion.h1
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  initial={{
                    opacity: 0,
                    y: -30,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="my-2 text-5xl font-bold leading-10"
                >
                  <span className="">Get in touch</span>
                </motion.h1>
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
                    </button>{" "}
                    for secure communication. Feel free to use it for encrypted
                    messages and to verify my
                    <Link href={LINKS.keyBase} name="identity."></Link>
                    Other than that, you can either
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

              {showCalendar ? (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mx-auto max-w-4xl">
                    <div className="rounded-lg p-6 shadow-lg">
                      <CalBooking
                        calLink="ashgw/30min"
                        config={{ theme: "dark" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      {!showCalendar ? <Footer /> : null}
      <Toaster />
    </div>
  );
}
