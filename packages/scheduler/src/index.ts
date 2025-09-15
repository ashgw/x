import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";
import type { ExclusiveUnion } from "ts-roids";

const qstashClient = new QstashClient({ token: env.QSTASH_TOKEN });

type Payload =
  | Blob
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | string;

interface ScheduleRo {
  id: string;
}

interface ScheduleBaseDto {
  url: string;
  payload: Payload;
}

type ScheduleType = ExclusiveUnion<
  | {
      atTime: {
        datetimeIso: string;
      };
    }
  | { cron: { expression: string } }
>;

type ScheduleDto = ScheduleBaseDto & ScheduleType;

export class SchedulerService {
  private static _headers = {
    "Content-Type": "application/json",
    "x-api-token": env.X_API_TOKEN,
  } as const;

  public async schedule(input: ScheduleDto): Promise<ScheduleRo> {
    if (input.atTime) {
      return this.scheduleAt({
        at: input.atTime.datetimeIso,
        ...input,
      });
    }
    return this.scheduleCron({
      expression: input.cron.expression,
      ...input,
    });
  }

  public async scheduleAt(input: {
    url: string;
    payload: Payload;
    at: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.publish({
      url: input.url,
      body: input.payload,
      headers: SchedulerService._headers,
      notBefore: SchedulerService._toUnixSecond(input.at),
    });
    return {
      id: response.messageId,
    };
  }

  public async scheduleCron(input: {
    url: string;
    payload: Payload;
    expression: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.schedules.create({
      destination: input.url,
      cron: input.expression,
      body: input.payload,
      headers: SchedulerService._headers,
    });
    return {
      id: response.scheduleId,
    };
  }

  private static _toUnixSecond(isoString: string): number {
    return Math.floor(new Date(isoString).getTime() / 1000);
  }
}
