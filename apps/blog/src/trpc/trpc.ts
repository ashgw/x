import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import type { TrpcContext } from "./context";
import { transformer } from "./transformer";

export const t = initTRPC.context<TrpcContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
