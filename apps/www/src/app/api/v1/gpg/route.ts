import type { NewType } from "ts-roids";
import { NextResponse } from "next/server";

import { monitor } from "@ashgw/observability";

type Key = NewType<"Key", string>;
type Err = string;

export async function GET(): Promise<NextResponse<Key> | NextResponse<Err>> {
  try {
    const res = await fetch("https://github.com/ashgw.gpg", {
      method: "GET",
      next: { revalidate: 36969 },
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch the public key", {
        status: 424,
      });
    }

    const key = await res.text();
    return new NextResponse(key);
  } catch (error) {
    return new NextResponse(monitor.next.captureException({ error }), {
      status: 500,
    });
  }
}
