"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCopyToClipboard } from "react-use";
import { toast, Toaster } from "sonner";

import { TextContent } from "@ashgw/components";
import { ossEmail, links } from "@ashgw/constants";

import Link from "./components/Link";
import { env } from "@ashgw/env";
import { ToggleSwitch } from "@ashgw/ui";

export function HomePage() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);

  const emailAddress = useMemo(
    () => (ossEmail.startsWith("mailto:") ? ossEmail.slice(7) : ossEmail),
    [],
  );

  const handleToggle = (state: boolean) => {
    setIsToggled(state);
    if (state) {
      copyToClipboard(links.twitter.link);
      toast.success("X copied");
    } else {
      copyToClipboard(emailAddress);
      toast.success("Email copied");
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
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="my-2 text-5xl font-bold leading-10"
                >
                  <code>~</code>
                </motion.h1>
                <div className="mx-auto max-w-[600px]">
                  <TextContent>
                    I just pushed some new content to my{" "}
                    <Link href={links.gitHub.link} name="Onlyfans" />
                    <br /> You might want to read my{" "}
                    <Link href={env.NEXT_PUBLIC_BLOG_URL} name="blog" />
                    <br />
                    You might as well
                  </TextContent>
                </div>
                <div className="mx-auto max-w-sm space-y-4 scale-80">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1 }}
                  >
                    <ToggleSwitch
                      leftButtonText="Email"
                      rightButtonText="X"
                      isToggled={isToggled}
                      onToggle={handleToggle}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Toaster />
    </div>
  );
}
