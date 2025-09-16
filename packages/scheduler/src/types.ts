import type { ExclusiveUnion } from "ts-roids";

export type Payload = string;

export interface ScheduleBaseDto {
  url: string;
  payload: Payload;
}

export interface AtDto extends ScheduleBaseDto {
  at: { datetimeIso: string };
}

export type Delay = ExclusiveUnion<
  | { seconds: number }
  | { minutes: number }
  | { hours: number }
  | { days: number }
>;

export interface DelayDto extends ScheduleBaseDto {
  delay: Delay;
}

export interface CronDto extends ScheduleBaseDto {
  cron: { expression: string };
}

export type ScheduleDto = AtDto | CronDto | DelayDto;

export interface ScheduleAtResult {
  messageId: string;
}

export interface ScheduleDelayResult {
  messageId: string;
}

export interface ScheduleCronResult {
  scheduleId: string;
}
