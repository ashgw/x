"use client";

import type { GlobalErrorProperties } from "@ashgw/components";
import { ErrorBoundary, Footer } from "@ashgw/components";
import { DesignSystemProvider } from "@ashgw/design/provider";

export default function GlobalError({ ...props }: GlobalErrorProperties) {
  return (
    <DesignSystemProvider>
      <main className="flex h-screen items-start justify-center pt-20">
        <ErrorBoundary {...props} />
      </main>
      <Footer />
    </DesignSystemProvider>
  );
}
