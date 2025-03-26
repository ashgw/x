"use client";

import "@ashgw/css/global";

import type { GlobalErrorProperties } from "@ashgw/components";
import { ErrorBoundary, Footer } from "@ashgw/components";
import { fonts } from "@ashgw/ui";

import { GoBackHome } from "./components/pages/root";

export default function GlobalError({ ...props }: GlobalErrorProperties) {
  return (
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <GoBackHome />
        <main className="flex h-screen items-start justify-center pt-20">
          <ErrorBoundary {...props} />
        </main>
      </body>
      <Footer />
    </html>
  );
}
