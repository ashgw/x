/* eslint-disable */
import React, { SVGProps } from 'react';

import Link from 'next/link';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';

export default function Component() {
  return (
    <div className="w-full py-10 lg:py-20">
      <div className="container grid items-start gap-4 px-4 text-center md:gap-6 lg:grid-cols-3 lg:items-center lg:px-6 xl:gap-10 xl:max-w-6xl xl:mx-auto">
        <div className="flex items-center justify-center space-y-4 lg:col-start-2 lg:space-y-10 lg:order-first">
          <div className="rounded-full overflow-hidden border-4 border-white border-opacity-25 shadow-xl">
            <img
              alt="Profile Picture"
              className="rounded-full object-cover"
              height="160"
              src="/placeholder.svg"
              style={{
                aspectRatio: '160/160',
                objectFit: 'cover',
              }}
              width="160"
            />
          </div>
        </div>
        <div className="space-y-4 lg:col-start-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Jane Doe
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Product Designer</p>
          </div>
          <div className="space-y-4 text-left lg:space-y-6">
            <p className="mx-auto max-w-prose md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              User experience enthusiast with a passion for designing beautiful
              and functional interfaces. I believe in the power of simplicity to
              create delightful user experiences.
            </p>
          </div>
        </div>
      </div>
      <div className="container grid max-w-3xl items-start gap-6 px-4 py-10 md:grid-cols-2 md:gap-10 md:py-16 lg:py-20">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Skills
            </h2>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <li>UI/UX Design</li>
              <li>Wireframing</li>
              <li>Prototyping</li>
              <li>Interaction Design</li>
              <li>Usability Testing</li>
              <li>Design Thinking</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Experience
            </h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Senior Designer</h3>
                <p>Acme Inc</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2020 - Present
                </p>
              </li>
              <li>
                <h3 className="font-bold">Lead Designer</h3>
                <p>Beta Co</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2016 - 2020
                </p>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              Education
            </h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Master of Design</h3>
                <p>Paradise University</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2014 - 2016
                </p>
              </li>
              <li>
                <h3 className="font-bold">Bachelor of Arts</h3>
                <p>Horizon College</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  2010 - 2013
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between space-y-4 md:space-y-0">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                Contact
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Reach out to me for collaboration or inquiries.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <MailIcon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <div>janedoe@example.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <PhoneIcon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <div>+1 (123) 456-7890</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Button className="w-full max-w-xs justify-center inline-flex gap-2">
              <TwitterIcon className="w-4 h-4 flex-shrink-0" />
              Tweet Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
interface TwitterIcon extends SVGProps<SVGSVGElement> {}

function TwitterIcon(props: TwitterIcon) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
