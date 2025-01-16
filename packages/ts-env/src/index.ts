import { z, ZodError } from "zod";

type Maybe<T> = T | undefined;

// Ensure we don’t have duplicates in disablePrefix
type UniqueArray<T extends readonly any[], Seen = never> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Head extends Seen
    ? ["Encountered duplicate env var", Head]
    : readonly [Head, ...UniqueArray<Tail, Seen | Head>]
  : T;

type EnvVar = Record<string, any>;

interface EnvSchema<
  V extends EnvVar,
  Prefix extends Maybe<string>,
  DisablePrefix extends readonly (keyof V & string)[] = [],
> {
  vars: V;
  prefix?: Prefix;
  skipValidation?: boolean;
  disablePrefix?: UniqueArray<DisablePrefix>;
}

type RenameKeys<
  E extends EnvVar,
  Prefix extends Maybe<string>,
  Disable extends string,
> = {
  [K in keyof E as K extends Disable
    ? // if key is in disablePrefix, don’t rename
      K
    : Prefix extends string
      ? K extends string
        ? `${Prefix}_${K}`
        : K
      : K]: E[K];
};

type InferEnvVars<V extends EnvVar> = {
  [K in keyof V]: z.infer<V[K]>;
};

type PrefixedEnvVars<
  V extends EnvVar,
  Prefix extends Maybe<string>,
  DisablePrefix extends keyof V & string = never,
> = RenameKeys<InferEnvVars<V>, Prefix, DisablePrefix>;

export function createEnv<
  V extends EnvVar,
  Prefix extends Maybe<string> = undefined,
  DisablePrefix extends readonly (keyof V & string)[] = [],
>(
  options: EnvSchema<V, Prefix, DisablePrefix>,
): PrefixedEnvVars<V, Prefix, DisablePrefix[number]> {
  const {
    vars,
    prefix,
    skipValidation = false,
    disablePrefix = [] as unknown as DisablePrefix,
  } = options;

  /**
   * 1. Distinguish if we’re on the server or in the browser
   * -----------------------------------------------------
   * Next.js only injects process.env for server code at runtime.
   * On the client, process.env is statically replaced at build time.
   */
  // @ts-expect-error window doesn't exist
  const isServer = typeof window === "undefined" || "Deno" in window;

  /**
   * 2. Build a minimal `runtimeEnv` based on server vs client
   * ---------------------------------------------------------
   * - Server: we can read everything from process.env
   * - Client: we only pick up the keys that start with the prefix
   *   (plus maybe the keys explicitly disabled from prefix)
   */
  let runtimeEnv: Record<string, Maybe<string>> = {};

  if (isServer) {
    // On the server, we can safely read all of process.env
    runtimeEnv = { ...process.env };
  } else {
    // On the client, we only preserve prefixed variables from process.env
    // (Note that in Next.js production builds, these are replaced at build time)
    if (prefix) {
      const entries = Object.entries(process.env);
      for (const [envKey, envVal] of entries) {
        // Only keep those that start with the prefix
        if (envKey.startsWith(prefix)) {
          runtimeEnv[envKey] = envVal;
        }
      }
    } else {
      // If no prefix is given at all, this effectively picks up nothing.
      // Because Next.js doesn't truly provide process.env in the client except for inlined strings.
      runtimeEnv = {};
    }
  }

  /**
   * 3. Transform the environment so it matches your local schema keys
   * -----------------------------------------------------------------
   * e.g. if prefix is "NEXT_PUBLIC", local key "WWW_URL" -> actual env key "NEXT_PUBLIC_WWW_URL"
   */
  const transformedEnv: Record<string, unknown> = {};

  for (const key of Object.keys(vars)) {
    // if the key is in `disablePrefix`, we skip adding the prefix
    const hasPrefix =
      prefix && !disablePrefix.includes(key as keyof V & string);
    const envKey = hasPrefix ? `${prefix}_${key}` : key;

    // Now pick it off runtimeEnv
    const value = runtimeEnv[envKey];
    if (value !== undefined) {
      transformedEnv[key] = value;
    }
  }

  /**
   * 4. If skipValidation = true, just return them as is
   * ---------------------------------------------------
   * Because you might want to handle validation later or skip altogether.
   */
  if (skipValidation) {
    const finalEnv: Record<string, unknown> = {};
    for (const key of Object.keys(vars)) {
      const hasPrefix =
        prefix && !disablePrefix.includes(key as keyof V & string);
      const envKey = hasPrefix ? `${prefix}_${key}` : key;
      finalEnv[envKey] = runtimeEnv[envKey];
    }
    return finalEnv as PrefixedEnvVars<V, Prefix, DisablePrefix[number]>;
  }

  /**
   * 5. Otherwise, validate with Zod
   * --------------------------------
   * We convert your `vars` object (Record<string, z.ZodType>) into a Zod object schema,
   * then validate the `transformedEnv`.
   */
  const schema = z.object(vars);
  const parsed = schema.safeParse(transformedEnv);

  if (!parsed.success) {
    // We’ll take the errors and swap in the prefixed keys so the user
    // sees the original environment variable name that’s actually failing
    const { fieldErrors } = (parsed.error as ZodError).flatten();
    const prefixedFieldErrors = Object.entries(fieldErrors).reduce<
      Record<string, string[]>
    >((acc, [key, messages]) => {
      if (messages) {
        const hasPrefix =
          prefix && !disablePrefix.includes(key as keyof V & string);
        const fullKey = hasPrefix ? `${prefix}_${key}` : key;
        acc[fullKey] = messages;
      }
      return acc;
    }, {});

    console.error("❌ Invalid environment variables:", prefixedFieldErrors);
    throw new Error("Invalid environment variables");
  }

  /**
   * 6. Construct the final environment object
   * -----------------------------------------
   * e.g. local key "WWW_URL" -> actual key "NEXT_PUBLIC_WWW_URL" (if prefix set)
   */
  const finalEnv: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    const hasPrefix =
      prefix && !disablePrefix.includes(key as keyof V & string);
    const envKey = hasPrefix ? `${prefix}_${key}` : key;
    finalEnv[envKey] = value;
  }

  return finalEnv as PrefixedEnvVars<V, Prefix, DisablePrefix[number]>;
}
