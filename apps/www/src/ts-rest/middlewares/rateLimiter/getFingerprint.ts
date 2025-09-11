import { createHash } from "crypto";

export function getFingerprint({ req }: { req: Request }): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown-ip";

  const ua = req.headers.get("user-agent") ?? "unknown-ua";
  const lang = req.headers.get("accept-language") ?? "unknown-lang";

  const raw = `${ip}|${ua}|${lang}`;
  return createHash("sha256").update(raw).digest("hex");
}
