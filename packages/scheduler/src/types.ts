export type Payload = string;

export interface ScheduleBaseDto {
  url: string;
  payload: Payload;
}

export interface AtDto extends ScheduleBaseDto {
  at: { datetimeIso: string };
}

export interface DelayDto extends ScheduleBaseDto {
  delay: { seconds: number };
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
