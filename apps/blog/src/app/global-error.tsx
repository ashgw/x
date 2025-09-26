"use client";

import type { GlobalErrorProperties } from "@ashgw/components";
import { ErrorBoundary, Footer } from "@ashgw/components";
import { DesignSystemHtmlProvider } from "@ashgw/design/provider";
import { GoBack } from "./components/pages/root";

export default function GlobalError({ ...props }: GlobalErrorProperties) {
  return (
    <DesignSystemHtmlProvider>
      <GoBack />
      <main className="flex h-screen items-start justify-center pt-20">
        <ErrorBoundary {...props} />
      </main>
      <Footer />
    </DesignSystemHtmlProvider>
  );
}
