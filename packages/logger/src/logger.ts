/*
  Lightweight, pluggable, isomorphic logger for Node/Next.js (server/edge) and browsers.
  - Environment-aware via NEXT_PUBLIC_CURRENT_ENV: "production" | "development" | "preview"
  - Console transport for dev/local
  - Optional Better Stack (Logtail) transport when token is provided
  - Minimal overhead; async transports are fire-and-forget with optional flush()
*/
import type { LogContext, LogLevel, LogRecord, Transport } from "./types";
import { LOG_LEVELS } from "./levels";
import { detectRuntimeEnv, LOGTAIL_TOKEN } from "./env";
import { nowIso } from "./util/time";
import { ConsoleTransport } from "./transports/console";
import { BetterStackTransport } from "./transports/betterstack";

export interface LoggerOptions {
  name?: string;
  level?: LogLevel;
  transports?: Transport[];
  context?: LogContext;
}

export class Logger {
  private name: string | undefined;
  private minimumLevel: LogLevel;
  private transports: Transport[];
  private baseContext: LogContext;

  constructor(options?: LoggerOptions) {
    this.name = options?.name;
    this.minimumLevel = options?.level ?? "info";
    this.transports = options?.transports ?? [];
    this.baseContext = options?.context;
  }

  setLevel(level: LogLevel): void {
    this.minimumLevel = level;
  }

  addTransport(transport: Transport): void {
    this.transports.push(transport);
  }

  withContext(context: LogContext): Logger {
    return new Logger({
      name: this.name,
      level: this.minimumLevel,
      transports: this.transports,
      context: { ...(this.baseContext ?? {}), ...(context ?? {}) },
    });
  }

  isEnabled(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minimumLevel];
  }

  async flush(): Promise<void> {
    await Promise.all(
      this.transports.map((t) =>
        typeof t.flush === "function" ? t.flush() : Promise.resolve(),
      ),
    );
  }

  private emit(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown,
  ): void {
    if (!this.isEnabled(level)) return;

    const record: LogRecord = {
      level,
      message,
      timestamp: nowIso(),
      context: { ...(this.baseContext ?? {}), ...(context ?? {}) },
      ...(error ? { error } : {}),
    };

    for (const t of this.transports) {
      try {
        const result = t.log(record) as unknown;
        if (result instanceof Promise) result.catch(() => undefined);
      } catch {
        // never throw from logger
      }
    }
  }

  trace(message: string, context?: LogContext): void {
    this.emit("trace", message, context);
  }
  debug(message: string, context?: LogContext): void {
    this.emit("debug", message, context);
  }
  info(message: string, context?: LogContext): void {
    this.emit("info", message, context);
  }
  warn(message: string, context?: LogContext): void {
    this.emit("warn", message, context);
  }
  error(message: string, error?: unknown, context?: LogContext): void {
    this.emit("error", message, context, error);
  }
  fatal(message: string, error?: unknown, context?: LogContext): void {
    this.emit("fatal", message, context, error);
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

function resolveDefaultLogger(): Logger {
  const runtimeEnv = detectRuntimeEnv();
  const forcedLevel = runtimeEnv === "development" ? "debug" : "info";

  const transports: Transport[] = [];

  if (runtimeEnv === "development") {
    transports.push(new ConsoleTransport({ level: "trace" }));
  } else if (runtimeEnv === "preview") {
    transports.push(new ConsoleTransport({ level: "warn" }));
  } else {
    transports.push(new ConsoleTransport({ level: "warn" }));
  }

  if (LOGTAIL_TOKEN) {
    transports.push(new BetterStackTransport(LOGTAIL_TOKEN));
  }

  return new Logger({ level: forcedLevel, transports });
}

export const logger = resolveDefaultLogger();
