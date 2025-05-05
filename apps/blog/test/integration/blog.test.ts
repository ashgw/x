import type { inferProcedureInput } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { expect, test } from "vitest";

import { db } from "@ashgw/db";

import type { AppRouter } from "~/api/router";
import { postDetailSchemaRo } from "~/api/models";
import { appRouter } from "~/api/router";
import { createTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/trpc";

function createTestContext() {
  return createTRPCContext({
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
    db,
  });
}

test("load and validate all blog posts", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);
  const posts = await caller.post.getPostCards();

  for (const post of posts) {
    expect(() => postDetailSchemaRo.parse(post)).not.toThrow();
  }
});

test("load and validate a single blog post", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    slug: "branded-types",
  };

  const post = await caller.post.getPost(input);

  expect(post).toMatchObject(postDetailSchemaRo.parse(post));
});
