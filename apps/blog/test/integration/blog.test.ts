import type { inferProcedureInput } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { expect, test } from "vitest";

import type { AppRouter } from "~/server/router";
import { postDataSchemaRo } from "~/server/models";
import { appRouter } from "~/server/router";
import { createTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/trpc";

test("fething a given blog post", async () => {
  const ctx = createTRPCContext({
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
  });

  const caller = createCallerFactory(appRouter)(ctx);
  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    blogPath: "public/blogs",
    filename: "branded-types.mdx",
  };

  const post = await caller.post.getPost(input);
  expect(post).toMatchObject(postDataSchemaRo.parse(post));
});
