import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  cacheControlsQueryDtoSchema,
  contentTypes,
  errorSchemaRo,
} from "./schemas";

const c = initContract();

export const v1Contract = c.router({
  myPost: {
    method: "POST",
    path: "/my-post",
    summary: "My post",
    body: z.object({
      title: z.string().min(1),
      content: z.number(),
    }),
    responses: {
      200: c.otherResponse({
        contentType: contentTypes.text,
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: {
      200: c.otherResponse({
        contentType: contentTypes.text,
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
  gpg: {
    method: "GET",
    path: "/gpg",
    summary: "Fetch public PGP key (armored text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: {
      200: c.otherResponse({
        contentType: contentTypes.pgp,
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
  debion: {
    method: "GET",
    path: "/debion",
    summary: "Fetch debion setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: {
      200: c.otherResponse({
        contentType: contentTypes.text,
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
  whisper: {
    method: "GET",
    path: "/whisper",
    summary: "Fetch Whisper setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: {
      200: c.otherResponse({
        contentType: contentTypes.text,
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
});
