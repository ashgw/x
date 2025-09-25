"use client";

import "@ashgw/design/css";

import type { GlobalErrorProperties } from "@ashgw/components";
import { ErrorBoundary, Footer } from "@ashgw/components";
import { fonts } from "@ashgw/design/fonts";

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
