import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { cacheControlsQueryDtoSchema, errorSchemaRo } from "./schemas";

const c = initContract();

export const v1Contract = c.router({
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: {
      200: c.otherResponse({
        contentType: "text/plain",
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
        contentType: "application/pgp-keys",
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
        contentType: "text/plain",
        body: z.string().min(1),
      }),
      424: errorSchemaRo,
      500: errorSchemaRo,
    },
  },
});
