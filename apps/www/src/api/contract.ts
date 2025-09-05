import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { httpErrorSchema } from "./schemas";
import { cacheControlsQueryDtoSchema } from "./functions/dtos";
import { contentTypes } from "./content-types";

const c = initContract();

export const v1Contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/health-check",
    summary: "Health check",
    responses: {
      200: z.object({ ping: z.literal("pong") }),
      424: httpErrorSchema,
      500: httpErrorSchema,
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
      424: httpErrorSchema,
      500: httpErrorSchema,
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
      424: httpErrorSchema,
      500: httpErrorSchema,
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
      424: httpErrorSchema,
      500: httpErrorSchema,
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
      424: httpErrorSchema,
      500: httpErrorSchema,
    },
  },
});
