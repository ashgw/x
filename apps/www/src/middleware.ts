import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // eslint-disable-next-line no-restricted-properties
  const targetBaseUrl = process.env.NEXT_PUBLIC_BLOG_URL;

  if (pathname.startsWith("/blog")) {
    const targetUrl = `${targetBaseUrl}${pathname}${search}`;
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*"],
};
