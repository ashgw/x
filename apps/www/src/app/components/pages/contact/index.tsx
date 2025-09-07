"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCopyToClipboard } from "react-use";
import { toast, Toaster } from "sonner";

import { Footer, TextContent } from "@ashgw/components";
import { email, gpg, links } from "@ashgw/constants";
import { ToggleSwitch } from "@ashgw/ui";

import { tsrQueryClient } from "~/api/client";
import { isFetchError, isUnknownErrorResponse } from "@ts-rest/react-query/v5";

import Link from "./components/Link";
import { CalBooking } from "./components/CalBooking";

export function ContactPage() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const gpgQuery = tsrQueryClient.gpg.useQuery({
    queryKey: ["gpgQuery"],
    queryData: {
      query: {
        revalidateSeconds: "20000",
      },
    },
    staleTime: 1000, // <- react-query options (optional)
  });

  async function copyGPG() {
    const query = await gpgQuery.refetch();

    if (query.error) {
      if (isFetchError(error)) {
        toast.error(gpg.id, { description: "Network error. Try again." });
        return;
      }
      // If the server replied with a status not in your contract
      if (isUnknownErrorResponse(error, contractEndpoint)) {
        toast.error(gpg.id, {
          description: `Unexpected status ${error.status}`,
        });
        return;
      }
      // Known error responses - your contract defines 424 and 500
      toast.error(gpg.id, {
        description:
          typeof error.body === "object" &&
          error.body &&
          "message" in error.body
            ? String((error.body as { message?: string }).message ?? "Failed")
            : "Failed",
      });
      return;
    }

    if (data?.status === 200) {
      copyToClipboard(data.body);
      toast.message(gpg.id, {
        description: "PGP public key block copied to clipboard",
      });
    }
  }

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
        <section className="mt-20 w-full py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <motion.h1
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="my-2 text-5xl font-bold leading-10"
                >
                  <span>Get in touch</span>
                </motion.h1>
                <div className="mx-auto max-w-[600px]">
                  <TextContent>
                    I prefer to use <Link href={links.twitter.link} name="X" />{" "}
                    for most communication. I use{" "}
                    <Link href={links.keyBase} name="GPG" /> for secure
                    communication, check my{" "}
                    <button onClick={copyGPG}>
                      <strong className="glows text-white underline">
                        ID.
                      </strong>
                    </button>{" "}
                    Otherwise, you can either
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
      {!showCalendar ? <Footer /> : null}
      <Toaster />
    </div>
  );
}
