import { logger, monitor } from "@ashgw/observability";
import { env } from "@ashgw/env";
import { endPoint } from "~/ts-rest/endpoint";
import { Client } from "@upstash/qstash";
import type {
  ReminderBodyDto,
  ReminderResponses,
  ReminderMessageCreatedRo,
} from "~/api/models";
import type { NotifyBodyDto } from "~/api/models/notify";
import { NotificationType } from "@ashgw/email";

function transformToReminderPayload(input: NotifyBodyDto): NotifyBodyDto {
  const { ...rest } = input;
  return {
    message: rest.message,
    title: rest.title,
    type: NotificationType.REMINDER,
  };
}

function toUnixSeconds(isoString: string): number {
  return Math.floor(new Date(isoString).getTime() / 1000);
}

export async function reminder({
  body: { schedule },
}: {
  body: ReminderBodyDto;
}): Promise<ReminderResponses> {
  try {
    const client = new Client({ token: env.QSTASH_TOKEN });
    const notifyUrl = env.NEXT_PUBLIC_WWW_URL + endPoint + "/reminder";

    if (schedule.kind === "at") {
      const payload = transformToReminderPayload(schedule.notification);
      const result = await client.publish({
        url: notifyUrl,
        body: JSON.stringify(payload),
        notBefore: toUnixSeconds(schedule.at),
        headers: {
          "Content-Type": "application/json",
          "x-api-token": env.X_API_TOKEN,
        },
      });

      return {
        status: 200,
        body: {
          created: [{ kind: "message", id: result.messageId, at: schedule.at }],
        },
      };
    }

    if (schedule.kind === "multiAt") {
      const created: ReminderMessageCreatedRo[] = [];

      for (const item of schedule.notifications) {
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
    const payload = transformToReminderPayload(schedule.notification);
    const upstashSchedule = await client.schedules.create({
      destination: notifyUrl,
      cron: schedule.cron.expression,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-api-token": env.X_API_TOKEN,
      },
    });

    return {
      status: 200,
      body: { created: [{ kind: "schedule", id: upstashSchedule.scheduleId }] },
    };
  } catch (error) {
    logger.error("reminder scheduling failed", { error });
    monitor.next.captureException({ error });
    return {
      status: 500,
      body: { code: "INTERNAL_ERROR", message: "Internal error" },
    };
  }
}
