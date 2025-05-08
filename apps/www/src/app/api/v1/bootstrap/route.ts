import type { NewType } from "ts-roids";
import { NextResponse } from "next/server";

import { monitor } from "@ashgw/observability";

type Script = NewType<"Key", string>;
type Err = string;

export async function GET(): Promise<NextResponse<Script> | NextResponse<Err>> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/AshGw/dotfiles/main/install/bootstrap",
      {
        method: "GET",
        mode: "no-cors",
        next: { revalidate: 36969 },
      },
    );
    if (!res.ok) {
      return new NextResponse("Failed to fetch the bootstrap script", {
        status: 424,
      });
    }

    const script = await res.text();
    return new NextResponse(script, { status: 200 });
  } catch (error) {
    return new NextResponse(monitor.next.captureException({ error }), {
      status: 500,
    });
  }
}
