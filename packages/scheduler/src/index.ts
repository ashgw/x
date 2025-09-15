import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";
import type { Payload, ScheduleDto, ScheduleRo } from "./types";

const qstashClient = new QstashClient({ token: env.QSTASH_TOKEN });

export class SchedulerService {
  constructor(
    private readonly _headers: Record<string, string> = {
      "Content-Type": "application/json",
    },
  ) {}

  public headers(headers: Record<string, string>): SchedulerService {
    return new SchedulerService({ ...this._headers, ...headers });
  }

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

  private async scheduleAt(input: {
    url: string;
    payload: Payload;
    atTime: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.publish({
      url: input.url,
      body: input.payload,
      headers: this._headers,
      notBefore: SchedulerService._toUnixSecond(input.atTime),
    });
    return { id: response.messageId };
  }

  private async scheduleCron(input: {
    url: string;
    payload: Payload;
    expression: string;
  }): Promise<ScheduleRo> {
    const response = await qstashClient.schedules.create({
      destination: input.url,
      cron: input.expression,
      body: input.payload,
      headers: this._headers,
    });
    return { id: response.scheduleId };
  }

  private static _toUnixSecond(isoString: string): number {
    return Math.floor(new Date(isoString).getTime() / 1000);
  }
}

export const scheduler = new SchedulerService();
