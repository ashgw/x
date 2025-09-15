import { logger, monitor } from "@ashgw/observability";
import { env } from "@ashgw/env";
import { endPoint } from "~/ts-rest/endpoint";
import type { ReminderBodyDto } from "~/api/models/reminder";
import type { ReminderResponses } from "~/api/models/reminder";

type Json = Record<string, unknown>;
const QSTASH_BASE = "https://qstash.upstash.io/v2";

function toUnixSeconds(iso: string): number {
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) throw new Error(`Invalid ISO timestamp: ${iso}`);
  const s = Math.floor(ms / 1000);
  if (s <= Math.floor(Date.now() / 1000)) {
    throw new Error(`Timestamp must be in the future: ${iso}`);
  }
  return s;
}

function coerceNotifyBody(input: Json): Json {
  const { title, message, subject } = input as {
    title: string;
    message: string;
    subject?: string;
  };
  // force type to REMINDER and drop "to"
  const body: Json = { title, message, type: "REMINDER" };
  if (subject) body.subject = subject;
  return body;
}

async function publishAt({
  notifyUrl,
  atIso,
  body,
  xApiToken,
}: {
  notifyUrl: string;
  atIso: string;
  body: Json;
  xApiToken: string;
}): Promise<string> {
  const ts = toUnixSeconds(atIso);
  const res = await fetch(`${QSTASH_BASE}/publish/${encodeURI(notifyUrl)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.QSTASH_TOKEN}`,
      "Content-Type": "application/json",
      "Upstash-Method": "POST",
      "Upstash-Not-Before": String(ts),
      // forward auth and content type so /notify passes authed() and parses JSON
      "Upstash-Forward-x-api-token": xApiToken,
      "Upstash-Forward-Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  const data = (await res.json().catch(() => ({}))) as { messageId?: string };
  logger.info("QStash publishAt result", { status: res.status, data });

  if (!res.ok || !data.messageId) {
    throw new Error(`QStash publish failed (${res.status})`);
  }
  return data.messageId;
}

async function createCron({
  notifyUrl,
  cronTz,
  cronExpr,
  body,
  xApiToken,
}: {
  notifyUrl: string;
  cronTz: string;
  cronExpr: string;
  body: Json;
  xApiToken: string;
}): Promise<string> {
  const cronHeader = `CRON_TZ=${cronTz} ${cronExpr}`;
  const res = await fetch(`${QSTASH_BASE}/schedules/${encodeURI(notifyUrl)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.QSTASH_TOKEN}`,
      "Content-Type": "application/json",
      "Upstash-Cron": cronHeader,
      "Upstash-Method": "POST",
      "Upstash-Forward-x-api-token": xApiToken,
      "Upstash-Forward-Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  const data = (await res.json().catch(() => ({}))) as { scheduleId?: string };
  logger.info("QStash createCron result", { status: res.status, data });

  if (!res.ok || !data.scheduleId) {
    throw new Error(`QStash schedule failed (${res.status})`);
  }
  return data.scheduleId;
}

export async function scheduleReminder(input: {
  baseUrl: string; // derived from request
  xApiToken: string; // from incoming header, forwarded to /notify
  body: ReminderBodyDto;
}): Promise<ReminderResponses> {
  const notifyUrl = `${input.baseUrl}${endPoint}/notify`;

  try {
    const s = input.body.schedule;

    if (s.kind === "at") {
      const payload = coerceNotifyBody(s.notification as Json);
      const id = await publishAt({
        notifyUrl,
        atIso: s.at,
        body: payload,
        xApiToken: input.xApiToken,
      });
      return {
        status: 200,
        body: { created: [{ kind: "message", id, at: s.at }] },
      };
    }

    if (s.kind === "multiAt") {
      const created: { kind: "message"; id: string; at: string }[] = [];
      for (const item of s.notifications) {
        const payload = coerceNotifyBody(item.notification as Json);
        const id = await publishAt({
          notifyUrl,
          atIso: item.at,
          body: payload,
          xApiToken: input.xApiToken,
        });
        created.push({ kind: "message", id, at: item.at });
      }
      return { status: 200, body: { created } };
    } else {
      // cron
      const payload = coerceNotifyBody(s.notification as Json);
      const id = await createCron({
        notifyUrl,
        cronTz: s.cron.timezone,
        cronExpr: s.cron.expression,
        body: payload,
        xApiToken: input.xApiToken,
      });
      return {
        status: 200,
        body: {
          created: [
            {
              id,
              kind: "schedule",
              at: s.cron.timezone,
            },
          ],
        },
      };
    }
  } catch (error) {
    logger.error("scheduleReminder failed", { error });
    monitor.next.captureException({ error });
    return {
      status: 500,
      body: { code: "INTERNAL_ERROR", message: "Internal error" },
    };
  }
}
