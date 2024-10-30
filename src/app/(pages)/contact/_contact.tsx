'use client';

import Footer from '@/app/components/footer/footer';
import { TextContent as C } from '@/app/components/reusables/content';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { ToggleSwitch } from '@/app/components/ui/toggle-switch';
import { EMAIL, GPG_PUBLIC_KEY_INTERNAL_URL } from '@/lib/constants';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { Toaster, toast } from 'sonner';

export default function Main() {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isToggled, setIsToggled] = useState(false);

  async function copyGPG() {
    const res = await fetch(GPG_PUBLIC_KEY_INTERNAL_URL, {
      method: 'GET',
    });
    if (!res.ok) {
      const failureMessage = await res.text();
      toast.message('Oops! Looks like something went wrong!', {
        description: failureMessage,
      });
    }
    const key = await res.text();
    copyToClipboard(key);
    toast.message('79821E0224D34EC4969FF6A8E5168EE090AE80D0', {
      description: 'PGP public key block is copied to your clipboard',
    });
  }

  const handleToggle = (state: boolean) => {
    setIsToggled(state);
    if (state) {
      window.location.href = 'https://calendly.com/ashgw'; // TODO: put this in env or consts or something
    } else {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full mt-20 py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <H1>
                  <span className="">Get in touch</span>
                </H1>
                <div className="mx-auto max-w-[600px]">
                  <C>
                    I use GPG for secure communication. You can copy my public
                    <button
                      onClick={async () => {
                        await copyGPG();
                      }}
                    >
                      <strong className="text-white glows underline">
                        key.
                      </strong>
                    </button>{' '}
                    Feel free to use it for encrypted messages and to verify my
                    identity. Other than that, you can
                  </C>
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
