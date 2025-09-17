import { Client as QstashClient } from "@upstash/qstash";
import { env } from "@ashgw/env";
import type {
  Payload,
  ScheduleDto,
  AtDto,
  CronDto,
  ScheduleAtResult,
  ScheduleCronResult,
  ScheduleDelayResult,
  DelayDto,
  Delay,
} from "./types";

const qstashClient = new QstashClient({ token: env.QSTASH_TOKEN });

class SchedulerService {
  constructor(
    private readonly _headers: Record<string, string> = {
      "Content-Type": "application/json",
    },
  ) {}

  public headers(headers: Record<string, string>): SchedulerService {
    return new SchedulerService({ ...this._headers, ...headers });
  }

  public async schedule(input: AtDto): Promise<ScheduleAtResult>;
  public async schedule(input: CronDto): Promise<ScheduleCronResult>;
  public async schedule(input: DelayDto): Promise<ScheduleDelayResult>;
  public async schedule(
    input: ScheduleDto,
  ): Promise<ScheduleAtResult | ScheduleCronResult | ScheduleDelayResult> {
    if ("at" in input) {
      return this.scheduleAt({
        atTime: input.at.datetimeIso,
        url: input.url,
        payload: input.payload,
      });
    }
    if ("delay" in input) {
      return this.scheduleDelay({
        delay: input.delay,
        url: input.url,
        payload: input.payload,
      });
    } else {
      // cron
      return this.scheduleCron({
        expression: input.cron.expression,
        url: input.url,
        payload: input.payload,
      });
    }
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

  private async scheduleDelay({
    delay,
    payload,
    url,
  }: {
    url: string;
    payload: Payload;
    delay: Delay;
  }): Promise<ScheduleDelayResult> {
    // here we just convert anuything we het into secoodsnand we send it as just an integer
    const normalizedDelayInSeconds = delay.days
      ? delay.days * 24 * 60 * 60
      : delay.hours
        ? delay.hours * 60 * 60
        : delay.minutes
          ? delay.minutes * 60
          : delay.seconds;

    const response = await qstashClient.publish({
      url: url,
      body: payload,
      headers: this._headers,
      delay: normalizedDelayInSeconds,
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
