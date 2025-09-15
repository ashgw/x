import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";
import type { Payload, ScheduleDto, ScheduleRo } from "./types";

const qstashClient = new QstashClient({ token: env.QSTASH_TOKEN });

export class SchedulerService {
  public headers = {
    "Content-Type": "application/json",
    "x-api-token": env.X_API_TOKEN,
  } as const;

  public async schedule(input: ScheduleDto): Promise<ScheduleRo> {
    if (input.at) {
      return this.scheduleAt({
        atTime: input.at.datetimeIso,
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
    atTime: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.publish({
      url: input.url,
      body: input.payload,
      headers: this.headers,
      notBefore: SchedulerService._toUnixSecond(input.atTime),
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
      headers: this.headers,
    });
    return {
      id: response.scheduleId,
    };
  }

  private static _toUnixSecond(isoString: string): number {
    return Math.floor(new Date(isoString).getTime() / 1000);
  }
}

export const scheduler = new SchedulerService();
