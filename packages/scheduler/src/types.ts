import type { ExclusiveUnion } from "ts-roids";

export type Payload =
  | Blob
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | string;

export interface ScheduleRo {
  id: string;
}

export interface ScheduleBaseDto {
  url: string;
  payload: Payload;
}

type ScheduleType = ExclusiveUnion<
  | {
      at: {
        datetimeIso: string;
      };
    }
  | { cron: { expression: string } }
>;

export type ScheduleDto = ScheduleBaseDto & ScheduleType;
