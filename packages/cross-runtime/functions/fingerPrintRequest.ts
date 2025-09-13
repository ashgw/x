import { sha256 } from "crypto-hash";
import parseForwarded from "forwarded-parse";

export async function getFingerprint(
  req: Request,
  ipSalt: string,
): Promise<string> {
  const h = req.headers;

  // Prefer RFC 7239 Forwarded
  const fwd = h.get("forwarded");
  const fromForwarded = fwd
    ? (() => {
        const arr = parseForwarded(fwd);
        return arr.at(-1)?.for;
      })()
    : undefined;

  // Then XFF first hop, then common vendor headers
  const xff = h.get("x-forwarded-for");
  const ip =
    (fromForwarded && normalizeIp(fromForwarded)) ??
    (xff && normalizeIp(xff.split(",")[0])) ??
    firstPresent(h, [
      "x-real-ip",
      "cf-connecting-ip",
      "true-client-ip",
      "fastly-client-ip",
      "fly-client-ip",
      "x-client-ip",
    ]) ??
    "unknown-ip";

  const ua = h.get("user-agent") ?? "unknown-ua";
  const lang = parseLang(h.get("accept-language"));

  const hashedIp = await sha256(ip + ipSalt);
  return sha256(`${hashedIp}|${ua}|${lang}`);
}

function firstPresent(h: Headers, names: string[]): string | null {
  for (const n of names) {
    const v = h.get(n);
    if (v) return normalizeIp(v);
  }
  return null;
}

function normalizeIp(v: string): string {
  let s = v
    .replace(/^"+|"+$/g, "")
    .replace(/^\[|\]$/g, "")
    .trim();
  if (s.startsWith("::ffff:")) s = s.slice(7);
  return s;
}

function parseLang(v: string | null): string {
  if (!v) return "und";
  return v.split(",")[0]?.split(";")[0]?.toLowerCase() || "und";
}
