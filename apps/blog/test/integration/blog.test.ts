import * as fs from "fs";
import type { inferProcedureInput } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NextRequest, NextResponse } from "next/server";
import { expect, test } from "vitest";

import type { AppRouter } from "~/server/router";
import { postDataSchemaRo } from "~/server/models";
import { appRouter } from "~/server/router";
import { createTRPCContext } from "~/trpc/context";
import { createCallerFactory } from "~/trpc/trpc";

test("fetching a given blog post", async () => {
  const ctx = createTRPCContext({
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
  });

  const blogPath = "public/blogs";
  const files = fs
    .readdirSync(blogPath)
    .filter((file) => file.endsWith(".mdx"));
  const randomFile = files[Math.floor(Math.random() * files.length)].replace(
    ".mdx",
    "",
  );

  const caller = createCallerFactory(appRouter)(ctx);
  const input: inferProcedureInput<AppRouter["post"]["getPost"]> = {
    blogPath: "public/blogs",
    filename: randomFile,
  };

  const post = await caller.post.getPost(input);
  expect(post).toMatchObject(postDataSchemaRo.parse(post));
});

test("fetching all blog posts", async () => {
  const ctx = createTRPCContext({
    req: {} as NextRequest,
    res: {} as NextResponse,
    trpcInfo: {} as FetchCreateContextFnOptions["info"],
  });

  const caller = createCallerFactory(appRouter)(ctx);
  const posts = await caller.post.getPosts({
    blogPath: "public/blogs",
  });
  for (const post of posts) {
    expect(() => postDataSchemaRo.parse(post)).not.toThrow();
  }
});
