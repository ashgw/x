"use client";

import type { GlobalErrorProperties } from "@ashgw/components";
import { ErrorBoundary } from "@ashgw/components";

export default function GlobalError({ error, reset }: GlobalErrorProperties) {
  return <ErrorBoundary error={error} reset={reset} />;
}
