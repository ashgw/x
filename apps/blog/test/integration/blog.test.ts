import * as fs from "fs";
import path from "path";
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

test("load and validate a single random blog post", async () => {
  const ctx = createTestContext();
  const caller = createCallerFactory(appRouter)(ctx);

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"));

  expect(files.length).toBeGreaterThan(0); // Guard: no blog files means broken test setup

  const randomFilename = path.basename(
    files[Math.floor(Math.random() * files.length)],
    ".mdx",
  );

  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    blogPath: BLOG_DIR,
    filename: randomFilename,
  };

  const post = await caller.post.getPost(input);

  expect(post).toMatchObject(postDataSchemaRo.parse(post));
});
