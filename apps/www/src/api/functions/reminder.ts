import { logger, monitor } from "@ashgw/observability";
import { env } from "@ashgw/env";
import { endPoint } from "~/ts-rest/endpoint";
import type {
  ReminderBodyDto,
  ReminderResponses,
  ReminderMessageCreatedRo,
} from "~/api/models";
import type { NotifyBodyDto } from "~/api/models/notify";
import { NotificationType } from "@ashgw/email";
import { scheduler } from "@ashgw/scheduler";

const notifyUrl = env.NEXT_PUBLIC_WWW_URL + endPoint + "/notify";
const authHeader = { "x-api-token": env.X_API_TOKEN };

function transformToReminderPayload(input: NotifyBodyDto): NotifyBodyDto {
  const { ...rest } = input;
  return {
    message: rest.message,
    title: rest.title,
    type: NotificationType.REMINDER,
  };
}

export async function reminder({
  body: { schedule },
}: {
  body: ReminderBodyDto;
}): Promise<ReminderResponses> {
  try {
    if (schedule.kind === "at") {
      const result = await scheduler
        .headers({
          ...authHeader,
        })
        .schedule({
          at: {
            datetimeIso: schedule.at,
          },
          payload: JSON.stringify(
            transformToReminderPayload(schedule.notification),
          ),
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
            ...authHeader,
          })
          .schedule({
            at: {
              datetimeIso: item.at,
            },
            url: notifyUrl,
            payload: JSON.stringify(
              transformToReminderPayload(item.notification),
            ),
          });

        created.push({ kind: "message", id: result.messageId, at: item.at });
      }

      return { status: 201, body: { created } };
    }

    const result = await scheduler
      .headers({
        ...authHeader,
      })
      .schedule({
        cron: {
          expression: schedule.cron.expression,
        },
        url: notifyUrl,
        payload: JSON.stringify(
          transformToReminderPayload(schedule.notification),
        ),
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
