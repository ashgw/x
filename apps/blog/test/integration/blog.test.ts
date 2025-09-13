import type { inferProcedureInput } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { expect, test } from "vitest";

import { db } from "@ashgw/db";

import type { AppRouter } from "~/api/router";
import { postCardSchemaRo, postArticleSchemaRo } from "~/api/models";
import { appRouter } from "~/api/router";
import { createTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/root";

function createTestContext() {
  return createTRPCContext({
    db,
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
  });
}

test("load and validate all blog posts", async () => {
  const testContext = createTestContext();
  const caller = createCallerFactory(appRouter)(testContext);
  const posts = await caller.post.getPublicPostCards();

  for (const post of posts) {
    expect(() => postCardSchemaRo.parse(post)).not.toThrow();
  }
});

test("load and validate a single blog post", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const cards = await caller.post.getPublicPostCards();
  expect(cards.length).toBeGreaterThan(0);

  const input: inferProcedureInput<AppRouter["post"]["getDetailedPublicPost"]> =
    {
      slug: cards[0]?.slug ?? "",
    };

  const post = await caller.post.getDetailedPublicPost(input);

  expect(post).toMatchObject(postArticleSchemaRo.parse(post));
});
