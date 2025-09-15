import { logger } from "@ashgw/observability";
import { env } from "@ashgw/env";
import { endPoint } from "~/ts-rest/endpoint";
import { Client } from "@upstash/qstash";
import type {
  ReminderBodyDto,
  ReminderResponses,
  ReminderMessageRo,
} from "~/api/models";
import type { NotifyBodyDto } from "~/api/models/notify";
import { NotificationType } from "@ashgw/email";

function transformToReminderPayload(input: NotifyBodyDto): NotifyBodyDto {
  const { ...rest } = input;
  return {
    ...rest,
    type: NotificationType.REMINDER,
  };
}

function toUnixSeconds(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000);
}

export async function reminder(input: {
  body: ReminderBodyDto;
}): Promise<ReminderResponses> {
  try {
    const client = new Client({ token: env.QSTASH_TOKEN });
    const notifyUrl = env.NEXT_PUBLIC_WWW_URL + endPoint + "/reminder";
    const s = input.body.schedule;

    if (s.kind === "at") {
      const payload = transformToReminderPayload(s.notification);
      const result = await client.publish({
        url: notifyUrl,
        body: JSON.stringify(payload),
        notBefore: toUnixSeconds(s.at),
        headers: {
          "Content-Type": "application/json",
          "x-api-token": env.X_API_TOKEN,
        },
      });

      return {
        status: 200,
        body: {
          created: [{ kind: "message", id: result.messageId, at: s.at }],
        },
      };
    }

    if (s.kind === "multiAt") {
      const created: ReminderMessageRo[] = [];

      for (const item of s.notifications) {
        const payload = transformToReminderPayload(item.notification);
        const result = await client.publish({
          url: notifyUrl,
          body: JSON.stringify(payload),
          notBefore: toUnixSeconds(item.at),
          headers: {
            "Content-Type": "application/json",
            "x-api-token": env.X_API_TOKEN,
          },
        });
        created.push({ kind: "message", id: result.messageId, at: item.at });
      }

      return { status: 200, body: { created } };
    }

    // cron schedule
    const payload = transformToReminderPayload(s.notification);
    const schedule = await client.schedules.create({
      destination: notifyUrl,
      cron: s.cron.expression,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        ...(env.X_API_TOKEN ? { "x-api-token": env.X_API_TOKEN } : {}),
      },
    });

    return {
      status: 200,
      body: { created: [{ kind: "schedule", id: schedule.scheduleId }] },
    };
  } catch (error) {
    logger.error("reminder scheduling failed", { error });
    return {
      status: 500,
      body: { code: "INTERNAL_ERROR", message: "Internal error" },
    };
  }
}
