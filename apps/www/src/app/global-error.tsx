"use client";

import type NextError from "next/error";
import { useEffect } from "react";

import { Button, fonts } from "@ashgw/ui";

import { captureException } from "~/utils/sentry";

interface GlobalErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en" className={fonts.atkinsonHyperlegible.className}>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-gray-400">
            We've logged this error and will look into it as soon as possible.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
