import type { NewType } from "ts-roids";
import { NextResponse } from "next/server";

type Key = NewType<"Key", string>;
type Err = string;

export async function GET(): Promise<NextResponse<Key> | NextResponse<Err>> {
  const res = await fetch("https://github.com/ashgw.gpg", {
    method: "GET",
    next: { revalidate: 36969 },
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch the public key", { status: 424 });
  }

  const key = await res.text();
  return new NextResponse(key);
}
