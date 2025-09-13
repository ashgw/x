// fp.ts
type GetReqFPOpts = {
  ipSalt: string; // keep secret, server-only
  ipHeaders?: string[]; // priority order
};

const DEFAULT_IP_HEADERS = [
  "x-forwarded-for",
  "x-real-ip",
  "cf-connecting-ip",
  "true-client-ip",
  "fly-client-ip",
] as const;

export async function getFingerprintFromRequest(
  req: Request,
  opts: GetReqFPOpts,
): Promise<string> {
  const { ipSalt, ipHeaders = DEFAULT_IP_HEADERS as unknown as string[] } =
    opts;

  const h = req.headers;

  // RFC 7239 Forwarded: for=1.2.3.4;proto=https;by=...
  const forwarded = h.get("forwarded") ?? "";
  const fromForwarded = forwarded.match(/for="?([^;," ]+)"?/i)?.[1] ?? null;

  const firstFromXff = (() => {
    const raw = h.get("x-forwarded-for");
    if (!raw) return null;
    // XFF can be "client, proxy1, proxy2"
    return raw.split(",")[0]?.trim() || null;
  })();

  let ip =
    firstFromXff ||
    fromForwarded ||
    firstPresentHeader(h, ipHeaders) ||
    "unknown-ip";

  ip = normalizeIp(ip);

  const ua = h.get("user-agent") ?? "unknown-ua";
  const lang = parseLang(h.get("accept-language"));

  const hashedIp = await sha256Hex(ip + ipSalt);
  return sha256Hex(`${hashedIp}|${ua}|${lang}`);
}

// Client-side variant (no headers, no trusted IP). Only use if you must.
// Prefer computing the fingerprint on the server.
export async function getClientFingerprint(opts: {
  ipSalt: string; // do NOT ship your secret salt to the browser
  ip?: string; // optional: inject from server if you fetched it
  userAgent?: string;
  language?: string;
}): Promise<string> {
  const ip = normalizeIp(opts.ip ?? "unknown-ip");
  const ua =
    opts.userAgent ??
    (typeof navigator !== "undefined" ? navigator.userAgent : "unknown-ua");
  const lang =
    opts.language ??
    (typeof navigator !== "undefined" ? navigator.language : "und");
  const normLang = parseLang(lang);
  const hashedIp = await sha256Hex(ip + opts.ipSalt);
  return sha256Hex(`${hashedIp}|${ua}|${normLang}`);
}

/** Cross-runtime SHA-256 to hex: Edge, Node, Browser */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);

  // Prefer Web Crypto everywhere
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return bufToHex(new Uint8Array(digest));
  }

  // Fallback for very old Node
  try {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-256 not available in this runtime");
  }
}

function bufToHex(arr: Uint8Array): string {
  let s = "";
  for (let i = 0; i < arr.length; i++)
    s += arr[i].toString(16).padStart(2, "0");
  return s;
}

function parseLang(v?: string | null): string {
  if (!v) return "und";
  // e.g. "en-US,en;q=0.9"
  const primary = v.split(",")[0]?.split(";")[0]?.toLowerCase()?.trim();
  return primary || "und";
}

function firstPresentHeader(h: Headers, names: string[]): string | null {
  for (const n of names) {
    const v = h.get(n);
    if (v) return v.trim();
  }
  return null;
}

function normalizeIp(ip: string): string {
  // Remove quotes or brackets from Forwarded header, normalize v4-mapped v6
  let v = ip.replace(/^"+|"+$/g, "").replace(/^\[|\]$/g, "");
  if (v.startsWith("::ffff:")) v = v.slice(7);
  return v;
}
