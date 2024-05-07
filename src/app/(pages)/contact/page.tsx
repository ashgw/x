'use client';
import Link from 'next/link';
import Footer from '@/app/components/footer/footer';
import { Button } from '@/app/components/ui/button';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { TextContent as C } from '@/app/components/reusables/content';
import { motion } from 'framer-motion';

import { EMAIL } from '@/lib/constants';
export default function Main() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full mt-20 py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <H1>Get in touch</H1>
                <div className="mx-auto max-w-[600px]">
                  <C>
                    I&apos;m available for business inquiries, and new
                    opportunities. Feel free to reach out through email. I will
                    get back to you as soon as possible.
                  </C>
                </div>
              </div>
              <div className="mx-auto max-w-sm space-y-2">
                <motion.div
                  className="space-y-4 glowsup"
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
                    <Button variant="navbar">email me</Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
