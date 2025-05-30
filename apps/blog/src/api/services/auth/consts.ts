export const AUTH_COOKIES_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

export const COOKIE_NAMES = {
  CSRF_TOKEN: "csrf_token",
  SESSION_ID: "_lksx_ssid",
} as const;

export const HEADER_NAMES = {
  CSRF_TOKEN: "x-csrf-token",
} as const;
