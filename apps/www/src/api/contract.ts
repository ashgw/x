import {
  checkHealthSchemaRos,
  fetchGpgFromUpstreamSchemaRos,
  fetchTextFromUpstreamSchemaRos,
} from "./models/ros";
import { cacheControlsQueryDtoSchema } from "./models/dtos";
import { c } from "./root";

export const v1Contract = c.router({
  healthCheck: {
    method: "GET",
    path: "/health-check",
    summary: "Health check",
    responses: checkHealthSchemaRos,
  },
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaRos,
  },
  gpg: {
    method: "GET",
    path: "/gpg",
    summary: "Fetch public PGP key (armored text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchGpgFromUpstreamSchemaRos,
  },
  debion: {
    method: "GET",
    path: "/debion",
    summary: "Fetch debion setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaRos,
  },
  whisper: {
    method: "GET",
    path: "/whisper",
    summary: "Fetch Whisper setup script (raw text)",
    query: cacheControlsQueryDtoSchema.optional(),
    responses: fetchTextFromUpstreamSchemaRos,
  },
});
