"use client";

import type { GlobalErrorProperties } from "@ashgw/components";
import { Error } from "@ashgw/components";

export default function GlobalError({ error, reset }: GlobalErrorProperties) {
  return <Error error={error} reset={reset} />;
}
