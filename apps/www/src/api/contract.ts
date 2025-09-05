import {
  checkHealthSchemaResponses,
  fetchTextFromUpstreamSchemaResponses,
} from "./models/ros";
import { cacheControlsQueryDtoSchema } from "./models/dtos";
import { c } from "./root";

export const v1Contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/health-check",
    summary: "Health check",
    responses: checkHealthSchemaResponses,
  },
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  gpg: {
    method: "GET",
    path: "/gpg",
    summary: "Fetch public PGP key (armored text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  debion: {
    method: "GET",
    path: "/debion",
    summary: "Fetch debion setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  whisper: {
    method: "GET",
    path: "/whisper",
    summary: "Fetch Whisper setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
});
