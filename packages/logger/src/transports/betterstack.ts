import type { LogRecord, Transport } from "../types";

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
      // swallow transport errors
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
