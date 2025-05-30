import { randomBytes } from "crypto";
import type { SerializeOptions } from "cookie";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import { env } from "@ashgw/env";

import { AUTH_COOKIES_MAX_AGE, COOKIE_NAMES } from "./consts";

const securedCookieOptions = {
  // @see https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-02#section-5.3.7
  sameSite: "lax",
  // @see https://owasp.org/www-community/HttpOnly
  path: "/",
  secure: env.NODE_ENV === "production" || env.NODE_ENV === "preview",
  maxAge: AUTH_COOKIES_MAX_AGE,
} satisfies SerializeOptions;

class SessionCookieService {
  public get({ req }: { req: NextRequest }): Optional<string> {
    const cookie = req.cookies.get(COOKIE_NAMES.SESSION_ID);
    return cookie?.value ?? null;
  }

  public set({ res, value }: { res: NextResponse; value: string }) {
    res.cookies.set(COOKIE_NAMES.SESSION_ID, value, {
      ...securedCookieOptions,
    });
  }

  public clear({ res }: { res: NextResponse }) {
    res.cookies.delete(COOKIE_NAMES.SESSION_ID);
  }
}

class CSRFCookieService {
  public get({ req }: { req: NextRequest }): Optional<string> {
    const cookie = req.cookies.get(COOKIE_NAMES.CSRF_TOKEN);
    return cookie?.value ?? null;
  }

  public set({ res }: { res: NextResponse }) {
    res.cookies.set(COOKIE_NAMES.CSRF_TOKEN, randomBytes(32).toString("hex"), {
      ...securedCookieOptions,
      //  only in prod, protect against subdomain takeover
      ...(env.NODE_ENV === "production" && {
        domain: env.NEXT_PUBLIC_BLOG_URL,
      }),
      httpOnly: false, // the frontend needs to access this cookie
    });
  }

  public clear({ res }: { res: NextResponse }) {
    res.cookies.delete(COOKIE_NAMES.CSRF_TOKEN);
  }
}

export class CookieService {
  public static session = new SessionCookieService();
  public static csrf = new CSRFCookieService();
}
