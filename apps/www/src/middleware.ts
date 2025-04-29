import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/blog")) {
    // eslint-disable-next-line no-restricted-properties
    const targetBaseUrl = process.env.NEXT_PUBLIC_BLOG_URL;
    const cleanPath = pathname.replace(/^\/blog/, "");
    const targetUrl = `${targetBaseUrl}${cleanPath}${search}`;
    return NextResponse.redirect(targetUrl);
  }

  if (pathname.startsWith("/booking")) {
    const cleanPath = pathname.replace(/^\/booking/, "");
    const targetUrl = `https://cal.com/ashgw/default${cleanPath}${search}`;
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/booking/:path*"],
};
