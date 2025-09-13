"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCopyToClipboard } from "react-use";
import { toast, Toaster } from "sonner";

import { TextContent } from "@ashgw/components";
import { email, gpg, links } from "@ashgw/constants";
import { ToggleSwitch } from "@ashgw/ui";

import { tsrQueryClientSide } from "~/ts-rest/client";
import Link from "./components/Link";
import { CalBooking } from "./components/CalBooking";

export function HomePage() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const gpgQuery = tsrQueryClientSide.gpg.useQuery({
    queryKey: ["gpgQuery"],
    queryData: {
      query: {
        revalidateSeconds: "20000",
      },
    },
    staleTime: 1000,
  });

  const handleToggle = (state: boolean) => {
    setIsToggled(state);
    if (state) {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="-mt-8 flex min-h-screen w-full items-center justify-center px-4 md:px-6">
          <div className="space-y-6 text-center">
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
                    Best way to reach me is to shoot me a DM on{" "}
                    <Link href={links.twitter.link} name="X"></Link>.<br /> I
                    use{" "}
                    <button
                      onClick={() => {
                        if (gpgQuery.data) {
                          copyToClipboard(gpgQuery.data.body);
                          toast.message(gpg.id, {
                            description:
                              "PGP public key block is copied to your clipboard",
                          });
                        }
                        if (gpgQuery.error) {
                          toast.error("!Oops my bad, please try again later");
                          return;
                        }
                      }}
                    >
                      <strong className="glows text-white underline">
                        GPG
                      </strong>
                    </button>{" "}
                    for
                    <Link href={links.keyBase} name="secure"></Link>{" "}
                    communication. Otherwise just email me
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
                        calLink="ashgw/default"
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
      <Toaster />
    </div>
  );
}
