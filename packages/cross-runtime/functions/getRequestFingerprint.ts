import { sha256 } from "crypto-hash";
import parseForwarded from "forwarded-parse";

type ForwardedKV = Readonly<Record<string, string | undefined>>;

export async function getFingerprint({
  req,
  ipSalt,
}: {
  req: Request;
  ipSalt: string;
}): Promise<string> {
  const h = req.headers;

  // RFC 7239: Forwarded
  const fwd = h.get("forwarded");
  const fromForwarded: string | undefined = fwd
    ? (() => {
        try {
          const arr = parseForwarded(fwd) as ForwardedKV[];
          return arr.at(-1)?.for;
        } catch {
          return undefined;
        }
      })()
    : undefined;

  // XFF first hop
  const xff = h.get("x-forwarded-for");
  const xffFirst = xff?.split(",")[0]?.trim();

  const ip =
    (fromForwarded && normalizeIp(fromForwarded)) ??
    (xffFirst && normalizeIp(xffFirst)) ??
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
    if (v) return normalizeIp(v.trim());
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
  const primary = v.split(",")[0]?.split(";")[0]?.toLowerCase()?.trim();
  return primary ?? "und";
}
