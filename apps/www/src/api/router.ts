import { tsr } from "@ts-rest/serverless/fetch";
import { v1Contract } from "~/api/contract";
import { Controllers } from "~/api/controllers";
import { isHttpError, internal } from "~/api/errors";

function safe<TArgs extends unknown[], TResp>(
  name: string,
  fn: (...args: TArgs) => Promise<TResp>,
): (...args: TArgs) => Promise<TResp> {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (isHttpError(e)) return e.toResponse() as unknown as TResp;
      // eslint-disable-next-line no-restricted-syntax
      console.error(`[REST] unhandled error in ${name}`, e);
      return internal("Internal error", {
        route: name,
      }).toResponse() as unknown as TResp;
    }
  };
}

export const router = tsr.router(v1Contract, {
  healthCheck: safe("healthCheck", async () => Controllers.healthCheck()),
  bootstrap: safe("bootstrap", async ({ query }) =>
    Controllers.bootstrap({ query }),
  ),
  gpg: safe("gpg", async ({ query }) => Controllers.gpg({ query })),
  debion: safe("debion", async ({ query }) => Controllers.debion({ query })),
  whisper: safe("whisper", async ({ query }) => Controllers.whisper({ query })),
});
