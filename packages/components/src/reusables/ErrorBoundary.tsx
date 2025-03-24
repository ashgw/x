"use client";

import { useEffect } from "react";

export function ErrorBoundary({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // TODO: handle this better G
    console.error(error);
  }, [error]);
  return (
    <div className="flex h-screen items-center justify-center">
      Error | Something happened, try refreshing.
    </div>
  );
}
