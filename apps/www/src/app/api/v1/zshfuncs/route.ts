import { NextResponse } from "next/server";

import { sentry } from "@ashgw/observability";

export async function GET(): Promise<NextResponse<string>> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/AshGw/zshfuncs/main/funcs.zsh",
      {
        method: "GET",
        mode: "no-cors",
        next: { revalidate: 36969 },
      },
    );

    if (!res.ok) {
      return NextResponse.json("Failed to fetch the bootstrap script", {
        status: 424,
      });
    }

    const script = await res.text();
    return NextResponse.json(script, { status: 200 });
  } catch (error) {
    return NextResponse.json(sentry.next.captureException(error), {
      status: 500,
    });
  }
}
