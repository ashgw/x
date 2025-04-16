import type { inferProcedureInput } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { expect, test } from "vitest";

import type { AppRouter } from "~/server/router";
import { postDataSchemaRo } from "~/server/models";
import { appRouter } from "~/server/router";
import { createTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/trpc";

const BLOG_DIR = "public/blogs";

function createTestContext() {
  return createTRPCContext({
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
  });
}

test("load and validate all blog posts", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const posts = await caller.post.getPosts({ blogPath: BLOG_DIR });

  for (const post of posts) {
    expect(() => postDataSchemaRo.parse(post)).not.toThrow();
  }
});

test("load and validate a single blog post", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    blogPath: BLOG_DIR,
    filename: "branded-types",
  };

  const post = await caller.post.getPost(input);

  expect(post).toMatchObject(postDataSchemaRo.parse(post));
});
