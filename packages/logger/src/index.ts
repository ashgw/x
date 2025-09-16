/*
  Lightweight, pluggable, isomorphic logger for Node/Next.js (server/edge) and browsers.
  - Environment-aware via NEXT_PUBLIC_CURRENT_ENV: "production" | "development" | "preview"
  - Console transport for dev/local
  - Optional Better Stack (Logtail) transport when token is provided
  - Minimal overhead; async transports are fire-and-forget with optional flush()
*/
import { env } from "@ashgw/env";

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

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

function detectRuntimeEnv(): RuntimeEnv {
  return env.NEXT_PUBLIC_CURRENT_ENV;
}

function nowIso(): string {
  return new Date().toISOString();
}

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

interface LogtailLike {
  log?: (
    message: string,
    level: string,
    context?: Record<string, unknown>,
  ) => Promise<void>;
  flush?: () => Promise<void>;
  trace?: (message: string, context?: Record<string, unknown>) => Promise<void>;
  debug?: (message: string, context?: Record<string, unknown>) => Promise<void>;
  info?: (message: string, context?: Record<string, unknown>) => Promise<void>;
  warn?: (message: string, context?: Record<string, unknown>) => Promise<void>;
  error?: (message: string, context?: Record<string, unknown>) => Promise<void>;
  fatal?: (message: string, context?: Record<string, unknown>) => Promise<void>;
}

export class BetterStackTransport implements Transport {
  private token: string;
  private client: LogtailLike | undefined;
  private importPromise: Promise<void> | undefined;

  constructor(token: string) {
    this.token = token;
  }

  private async ensureClient(): Promise<void> {
    if (this.client) return;
    if (!this.importPromise) {
      this.importPromise = (async () => {
        type NextLogtailCtor = new (token: string) => unknown;
        const modUnknown = (await import("@logtail/next")) as unknown;
        const mod = modUnknown as Partial<{
          Logtail: NextLogtailCtor;
          default: NextLogtailCtor;
        }>;
        const maybeCtor: NextLogtailCtor | undefined =
          mod.Logtail ?? mod.default;

        if (maybeCtor) {
          const instance = new maybeCtor(this.token);
          const isFunction = (
            v: unknown,
          ): v is (...args: unknown[]) => unknown => typeof v === "function";
          const isLike = (obj: unknown): obj is LogtailLike => {
            if (!obj || typeof obj !== "object") return false;
            const o = obj as Record<string, unknown>;
            // At least one logging method present implies a valid client
            return [o.log, o.info, o.error].some(isFunction);
          };
          if (isLike(instance)) this.client = instance;
        }
      })();
    }
    await this.importPromise;
  }

  async log(record: LogRecord): Promise<void> {
    await this.ensureClient();
    const client = this.client;
    if (!client) return;

    const context = record.context ?? {};
    const message = record.message;
    const level = record.level;
    const withExtras = {
      timestamp: record.timestamp,
      ...context,
      ...(record.error ? { error: record.error } : {}),
    };

    try {
      // Prefer level method if present, otherwise fallback to log(message, level, context)
      const levelMethod = (client as Record<string, unknown>)[level];
      if (typeof levelMethod === "function") {
        await (
          levelMethod as (
            msg: string,
            ctx?: Record<string, unknown>,
          ) => Promise<void>
        )(message, withExtras);
      } else if (typeof client.log === "function") {
        await client.log(message, level, withExtras);
      }
    } catch {
      // Swallow transport errors to keep logging non-blocking
    }
  }

  async flush(): Promise<void> {
    try {
      await this.ensureClient();
      if (this.client && typeof this.client.flush === "function") {
        await this.client.flush();
      }
    } catch {
      // noop
    }
  }
}

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

    // Synchronous console transport remains fast; async transports fire-and-forget.
    for (const t of this.transports) {
      try {
        const result = t.log(record) as unknown;
        if (result instanceof Promise) {
          // Avoid unhandled rejections
          result.catch(() => undefined);
        }
      } catch {
        // Never throw from logger
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
    // production: keep console minimal to avoid noise, but surface warnings/errors locally
    transports.push(new ConsoleTransport({ level: "warn" }));
  }

  const logtailToken = env.NEXT_PUBLIC_LOGTAIL_INGESTION_TOKEN;

  if (logtailToken) {
    transports.push(new BetterStackTransport(logtailToken));
  }

  const logger = new Logger({
    level: forcedLevel,
    transports,
  });

  return logger;
}

export const logger = resolveDefaultLogger();
