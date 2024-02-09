/* eslint-disable */
import Link from 'next/link';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import React, { SVGProps } from 'react';

export default function StartUp() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Services
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Welcome to Acme Inc
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Your trusted partner for building modern web applications
                  using the latest technologies.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl mx-auto items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  About Us
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We are a team of experienced developers who are passionate
                  about creating exceptional web experiences. We specialize in
                  using Next.js and React to build fast, modern, and scalable
                  web applications. Let us help you turn your ideas into
                  reality.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="grid gap-4">
                  <Input
                    className="w-full"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-500">
                  Sign up to get notified when we launch.
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl mx-auto items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our Services
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We offer a range of services to meet your needs. Whether
                  you're looking for a custom web application, an e-commerce
                  platform, or a company website, we've got you covered.
                </p>
              </div>
              <div className="mx-auto w-full max-w-5xl grid items-start gap-4">
                <ul className="grid gap-4">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Custom Web Apps</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Let us build a tailored web application to meet your
                        specific requirements.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        E-commerce Platforms
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        We can create a seamless online shopping experience for
                        your customers.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Company Websites</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Make a great first impression with a professional and
                        modern website.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl mx-auto items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Technologies We Use
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We are experts in using the latest technologies to deliver
                  high-quality web applications. Our toolkit includes:
                </p>
              </div>
              <div className="mx-auto w-full max-w-5xl grid items-start gap-4">
                <ul className="grid gap-4">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Next.js</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        The perfect framework for building fast and scalable web
                        applications.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">React</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        The popular JavaScript library for building user
                        interfaces.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Backend Technologies
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        We use the latest backend technologies to power our web
                        applications.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl mx-auto items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Client Testimonials
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Don't just take our word for it. Here's what our clients have
                  to say about our services.
                </p>
              </div>
              <div className="mx-auto w-full max-w-5xl grid items-start gap-4">
                <div className="grid gap-2">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Testimonial
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Acme Inc did an amazing job building our web application.
                    The team was professional, responsive, and delivered
                    high-quality work on time. I would highly recommend their
                    services to anyone looking for a top-notch web development
                    company.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Testimonial
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The Acme Inc team was a pleasure to work with. They took the
                    time to understand our requirements and provided valuable
                    insights throughout the project. The end result exceeded our
                    expectations, and we couldn't be happier with our new web
                    application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid max-w-5xl mx-auto items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Contact Us
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Ready to get started? Contact us to discuss your project
                  requirements or to request a quote. We're here to help.
                </p>
              </div>
              <div className="mx-auto w-full max-w-5xl space-y-4">
                <form className="grid gap-4">
                  <Input
                    className="w-full max-w-[400px]"
                    placeholder="Name"
                    type="text"
                  />
                  <Input
                    className="w-full max-w-[400px]"
                    placeholder="Email"
                    type="email"
                  />
                  <Textarea className="w-full" placeholder="Message" />
                  <Button type="submit">Submit</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
interface MountainIconProps extends SVGProps<SVGSVGElement> {}

function MountainIcon(props: MountainIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
