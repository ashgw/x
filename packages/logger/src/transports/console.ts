import type { LogLevel, LogRecord, Transport } from "../types";
import { LOG_LEVELS } from "../levels";

export class ConsoleTransport implements Transport {
  private minimumLevel: LogLevel;

  constructor(options?: { level?: LogLevel }) {
    this.minimumLevel = options?.level ?? "trace";
  }

  log(record: LogRecord): void {
    if (LOG_LEVELS[record.level] < LOG_LEVELS[this.minimumLevel]) return;

    const payload: unknown[] = [
      `[${record.level.toUpperCase()}]`,
      record.timestamp,
      record.message,
    ];
    if (record.context) payload.push(record.context);
    if (record.error) payload.push(record.error);

    interface ConsoleLike {
      trace?: (...args: unknown[]) => void;
      debug?: (...args: unknown[]) => void;
      info?: (...args: unknown[]) => void;
      warn?: (...args: unknown[]) => void;
      error?: (...args: unknown[]) => void;
      log?: (...args: unknown[]) => void;
    }

    const con = Reflect.get(globalThis as object, "console") as
      | ConsoleLike
      | undefined;

    switch (record.level) {
      case "trace":
        con?.trace?.(...payload);
        break;
      case "debug":
        con?.debug?.(...payload);
        break;
      case "info":
        con?.info?.(...payload);
        break;
      case "warn":
        con?.warn?.(...payload);
        break;
      case "error":
      case "fatal":
        con?.error?.(...payload);
        break;
      default:
        con?.log?.(...payload);
        break;
    }
  }
}
