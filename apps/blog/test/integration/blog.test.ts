import type { inferProcedureInput } from "@trpc/server";
import { expect, test } from "vitest";

import { db } from "@ashgw/db";

import type { AppRouter } from "~/api/router";
import { postCardSchemaRo, postDetailSchemaRo } from "~/api/models";
import { appRouter } from "~/api/router";
import { createInnerTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/trpc";
import type { NextRequest, NextResponse } from "next/server";

function createTestContext() {
  return createInnerTRPCContext({
    db,
  });
}

test("load and validate all blog posts", async () => {
  const innerContext = createTestContext();
  const caller = createCallerFactory(appRouter)({
    ...innerContext,
    user: null,
    req: {} as NextRequest,
    res: {} as NextResponse,
  });
  const posts = await caller.post.getPostCards();

  for (const post of posts) {
    expect(() => postCardSchemaRo.parse(post)).not.toThrow();
  }
});

test("load and validate a single blog post", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    slug: "branded-types", // already have this one seeded
  };

  const post = await caller.post.getPost(input);

  expect(post).toMatchObject(postDetailSchemaRo.parse(post));
});
