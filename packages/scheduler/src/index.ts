import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";

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
export class SchedulerService {
  private static _headers = {
    "Content-Type": "application/json",
    "x-api-token": env.X_API_TOKEN,
  } as const;

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
    cron: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.schedules.create({
      destination: input.url,
      cron: input.cron,
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
