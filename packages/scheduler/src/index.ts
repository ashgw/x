import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";
import type {
  Payload,
  ScheduleDto,
  AtDto,
  CronDto,
  ScheduleAtResult,
  ScheduleCronResult,
} from "./types";

const qstashClient = new QstashClient({ token: env.QSTASH_TOKEN });

// TODO: throw errors here if bad
// TODO: add InternalError usage & logger later
// simply console.error now
class SchedulerService {
  constructor(
    private readonly _headers: Record<string, string> = {
      "Content-Type": "application/json",
    },
  ) {}

  public headers(headers: Record<string, string>): SchedulerService {
    return new SchedulerService({ ...this._headers, ...headers });
  }

  // Overloads give exact return types based on input
  public async schedule(input: AtDto): Promise<ScheduleAtResult>;
  public async schedule(input: CronDto): Promise<ScheduleCronResult>;
  public async schedule(
    input: ScheduleDto,
  ): Promise<ScheduleAtResult | ScheduleCronResult> {
    if ("at" in input) {
      return this.scheduleAt({
        atTime: input.at.datetimeIso,
        url: input.url,
        payload: input.payload,
      });
    }
    return this.scheduleCron({
      expression: input.cron.expression,
      url: input.url,
      payload: input.payload,
    });
  }

  private async scheduleAt(input: {
    url: string;
    payload: Payload;
    atTime: string;
  }): Promise<ScheduleAtResult> {
    const response = await qstashClient.publish({
      url: input.url,
      body: input.payload,
      headers: this._headers,
      notBefore: SchedulerService._toUnixSecond(input.atTime),
    });
    return { messageId: response.messageId };
  }

  private async scheduleCron(input: {
    url: string;
    payload: Payload;
    expression: string;
  }): Promise<ScheduleCronResult> {
    const response = await qstashClient.schedules.create({
      destination: input.url,
      cron: input.expression,
      body: input.payload,
      headers: this._headers,
    });
    return { scheduleId: response.scheduleId };
  }

  private static _toUnixSecond(isoString: string): number {
    return Math.floor(new Date(isoString).getTime() / 1000);
  }
}

export const scheduler = new SchedulerService();
