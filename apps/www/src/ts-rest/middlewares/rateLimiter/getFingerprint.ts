import { createHash } from "crypto";
import { env } from "@ashgw/env";

// TODO: add this to it's own package and call it fp
export function getFingerprint({ req }: { req: Request }): string {
  const forwarded = req.headers.get("forwarded");
  const fromForwarded = forwarded?.match(/for="?([^;," ]+)"?/i)?.[1];

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    fromForwarded ??
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("true-client-ip") ??
    req.headers.get("fly-client-ip") ??
    "unknown-ip";

  const ua = req.headers.get("user-agent") ?? "unknown-ua";

  const langRaw = req.headers.get("accept-language") ?? "und";
  const lang = langRaw.split(",")[0]?.split(";")[0]?.toLowerCase() ?? "und";

  const hashedIp = createHash("sha256")
    .update(ip + env.IP_HASH_SALT)
    .digest("hex");

  const raw = `${hashedIp}|${ua}|${lang}`;
  return createHash("sha256").update(raw).digest("hex");
}
