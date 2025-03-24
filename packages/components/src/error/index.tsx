"use client";

import type NextError from "next/error";
import { useEffect } from "react";

import { sentry } from "@ashgw/observability";
import { Button } from "@ashgw/ui";

export interface GlobalErrorProperties {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
}

export const ErrorBoundary = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    sentry.captureException(error);
  }, [error]);

  return (
    <div className="dimmed-3 flex h-screen w-full flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md">
        We've logged this error and will look into it as soon as possible.
      </p>
      <Button
        variant="navbar"
        onClick={() => {
          reset();
        }}
      >
        Try again
      </Button>
    </div>
  );
};
