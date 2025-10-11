import { logger } from "@ashgw/logger";
import { monitor } from "@ashgw/monitor";
import { env } from "@ashgw/env";
import { apiV1endpoint } from "~/ts-rest/endpoint";
import type {
  ReminderCreateBodyDto,
  ReminderResponses,
  ReminderMessageCreatedRo,
  ReminderCreateHeadersDto,
} from "~/api/models";
import { scheduler } from "@ashgw/scheduler";
import { endpoints } from "~/api/endpoints";

const notifyUrl = env.NEXT_PUBLIC_WWW_URL + apiV1endpoint + endpoints.notify;

export async function reminder({
  body: { schedule },
  headers,
}: {
  body: ReminderCreateBodyDto;
  headers: ReminderCreateHeadersDto;
}): Promise<ReminderResponses> {
  try {
    if (schedule.kind === "at") {
      const result = await scheduler
        .headers({
          ...headers,
        })
        .schedule({
          at: {
            datetimeIso: schedule.at,
          },
          payload: JSON.stringify(schedule.notification),
          url: notifyUrl,
        });

      return {
        status: 201,
        body: {
          created: [{ kind: "message", id: result.messageId, at: schedule.at }],
        },
      };
    }

    if (schedule.kind === "multiAt") {
      const created: ReminderMessageCreatedRo[] = [];
      for (const item of schedule.notifications) {
        const result = await scheduler
          .headers({
            ...headers,
          })
          .schedule({
            at: {
              datetimeIso: item.at,
            },
            url: notifyUrl,
            payload: JSON.stringify(item.notification),
          });

        created.push({ kind: "message", id: result.messageId, at: item.at });
      }

      return { status: 201, body: { created } };
    }

    if (schedule.kind === "delay") {
      const delayObjectNormalizer = () => {
        const value = schedule.delay.value;
        const unitMap = {
          days: { days: value },
          hours: { hours: value },
          minutes: { minutes: value },
          seconds: { seconds: value },
        } as const;

        return unitMap[schedule.delay.unit];
      };

      const result = await scheduler
        .headers({
          ...headers,
        })
        .schedule({
          delay: { ...delayObjectNormalizer() },
          url: notifyUrl,
          payload: JSON.stringify(schedule.notification),
        });

      return {
        status: 201,
        body: { created: [{ kind: "message", id: result.messageId }] },
      };
    }
    const result = await scheduler
      .headers({
        ...headers,
      })
      .schedule({
        cron: {
          expression: schedule.cron.expression,
        },
        url: notifyUrl,
        payload: JSON.stringify(schedule.notification),
      });

    return {
      status: 201,
      body: { created: [{ kind: "schedule", id: result.scheduleId }] },
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
