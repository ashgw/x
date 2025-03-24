"use client";

// TODO: move this to components
import type NextError from "next/error";
import { useEffect } from "react";

import { sentry } from "@ashgw/observability";
import { Button, fonts } from "@ashgw/ui";

interface GlobalErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className={fonts.atkinsonHyperlegible.className}>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="max-w-md">
            We've logged this error and will look into it as soon as possible.
          </p>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
