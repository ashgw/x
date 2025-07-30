import { randomBytes } from "crypto";
import type { SerializeOptions } from "cookie";
import type { NextRequest, NextResponse } from "next/server";
import type { Optional } from "ts-roids";

import { env } from "@ashgw/env";

import { AUTH_COOKIES_MAX_AGE, COOKIE_NAMES } from "./consts";

const securedCookieOptions = {
  sameSite: "lax" as const,
  path: "/",
  secure: env.NODE_ENV !== "development",
  maxAge: AUTH_COOKIES_MAX_AGE,
  httpOnly: true,
  ...(env.NODE_ENV === "production" && {
    domain: env.NEXT_PUBLIC_BLOG_URL,
  }),
} satisfies SerializeOptions;

class _SessionCookieService {
  public get({ req }: { req: NextRequest }): Optional<string> {
    const cookie = req.cookies.get(COOKIE_NAMES.SESSION);
    return cookie?.value ?? null;
  }

  public set({ res, value }: { res: NextResponse; value: string }) {
    res.cookies.set(COOKIE_NAMES.SESSION, value, {
      ...securedCookieOptions,
    });
  }

  public clear({ res }: { res: NextResponse }) {
    res.cookies.delete(COOKIE_NAMES.SESSION);
  }
}

class _CSRFCookieService {
  public get({ req }: { req: NextRequest }): Optional<string> {
    const cookie = req.cookies.get(COOKIE_NAMES.CSRF_TOKEN);
    return cookie?.value ?? null;
  }

  public set({ res }: { res: NextResponse }) {
    res.cookies.set(COOKIE_NAMES.CSRF_TOKEN, randomBytes(32).toString("hex"), {
      ...securedCookieOptions,
      httpOnly: false,
    });
  }

  public clear({ res }: { res: NextResponse }) {
    res.cookies.delete(COOKIE_NAMES.CSRF_TOKEN);
  }
}

export class CookieService {
  public static session = new _SessionCookieService();
  public static csrf = new _CSRFCookieService();
}
