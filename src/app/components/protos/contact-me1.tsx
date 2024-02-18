/* eslint-disable */

import Link from 'next/link';
import Footer from '@/app/components/footer/footer';
import { Button } from '@/app/components/ui/button';
import { Heading1 as H1 } from '@/app/components/reusables/headers';
import { TextContent as C } from '@/app/components/reusables/content';
export default function Freelance() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1">
        <section className="w-full mt-20 py-12 md:mt-0 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <H1>Let's get in touch</H1>
                <div className="mx-auto max-w-[600px]">
                  <C>
                    I'm available for freelance work, business inquiries, and
                    new opportunities. Feel free to reach out thorught email. I
                    will get back to you as soon as possible.
                  </C>
                </div>
              </div>
              <div className="mx-auto max-w-sm space-y-2">
                <div className="space-y-4 glowsup">
                  <Link href="mailto:ashrefgw@proton.me">
                    <Button variant="navbar">email me</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
