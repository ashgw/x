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

const qstashHeaders = {
  "Content-Type": "application/json",
  "x-api-token": env.X_API_TOKEN,
} as const;

const client = new Client({ token: env.QSTASH_TOKEN });

export async function reminder({
  body: { schedule },
}: {
  body: ReminderBodyDto;
}): Promise<ReminderResponses> {
  try {
    const notifyUrl = env.NEXT_PUBLIC_WWW_URL + endPoint + "/notify";

    if (schedule.kind === "at") {
      const result = await client.publish({
        url: notifyUrl,
        body: JSON.stringify(transformToReminderPayload(schedule.notification)),
        notBefore: toUnixSeconds(schedule.at),
        headers: qstashHeaders,
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
        const result = await client.publish({
          url: notifyUrl,
          body: JSON.stringify(transformToReminderPayload(item.notification)),
          notBefore: toUnixSeconds(item.at),
          headers: qstashHeaders,
        });
        created.push({ kind: "message", id: result.messageId, at: item.at });
      }

      return { status: 200, body: { created } };
    }
    const upstashSchedule = await client.schedules.create({
      destination: notifyUrl,
      cron: schedule.cron.expression,
      body: JSON.stringify(transformToReminderPayload(schedule.notification)),
      headers: qstashHeaders,
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
