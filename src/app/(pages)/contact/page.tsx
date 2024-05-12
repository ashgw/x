'use client';
import Link from 'next/link';
import Footer from '@/app/components/footer/footer';
import { Button } from '@/app/components/ui/button';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { TextContent as C } from '@/app/components/reusables/content';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { useCopyToClipboard } from 'react-use';

import { EMAIL, GPG_PUBLIC_KEY_INTERNAL_URL } from '@/lib/constants';

export default function Main() {
  const [, copyToClipboard] = useCopyToClipboard();

  const successToast = () => {
    toast.message('Key ID: 79821E0224D34EC4969FF6A8E5168EE090AE80D0', {
      description: 'The public key block has been copied to your clipboard',
    });
  };

  const failToast = (message?: string) => {
    toast.message('Oops! Looks like something went wrong!', {
      description: message,
    });
  };

  async function copyGPG() {
    const res = await fetch(GPG_PUBLIC_KEY_INTERNAL_URL, {
      method: 'GET',
    });
    if (!res.ok) {
      const failureMessage = await res.text();
      failToast(failureMessage);
    }
    const key = await res.text();
    copyToClipboard(key);
    successToast();
  }
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
                    Feel free to reach out through email. I will get back to you
                    as soon as possible. If you prefer to communicate securely,
                    use my <span> </span>
                    <button
                      onClick={async () => {
                        await copyGPG();
                      }}
                    >
                      <strong className="text-white glows underline">
                        GPG
                      </strong>
                    </button>
                    <span> </span> key to encrypt messages before you
                  </C>
                </div>
              </div>
              <div className="mx-auto max-w-sm space-y-2">
                <motion.div
                  className="space-y-4 "
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 1,
                  }}
                >
                  <Link href={`mailto:${EMAIL}`}>
                    <Button className="glowsup" variant="navbar">
                      email me
                    </Button>
                  </Link>
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
