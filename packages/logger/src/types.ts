export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export type RuntimeEnv = "production" | "development" | "preview";

export type LogContext = Record<string, unknown> | undefined;

export interface LogRecord {
  level: LogLevel;
  message: string;
  timestamp: string; // ISO
  context?: LogContext;
  error?: unknown;
}

export interface Transport {
  log(record: LogRecord): void | Promise<void>;
  flush?(): Promise<void>;
}
