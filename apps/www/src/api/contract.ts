import {
  checkHealthSchemaResponses,
  fetchGpgFromUpstreamSchemaResponses,
  fetchTextFromUpstreamSchemaResponses,
  purgeViewWindowCronSchemaResponses,
} from "./schemas/responses";
import {
  cacheControlsQueryRequestSchemaDto,
  purgeViewWindowCronSchemaDto,
} from "./schemas/dtos";
import { c } from "./root";

export const v1Contract = c.router({
  purgeViewWindow: {
    method: "DELETE",
    path: "/pruge-view-window",
    strictStatusCodes: true,
    headers: purgeViewWindowCronSchemaDto,
    responses: purgeViewWindowCronSchemaResponses,
  },
  healthCheck: {
    method: "GET",
    path: "/health-check",
    strictStatusCodes: true,
    summary: "Health check",
    responses: checkHealthSchemaResponses,
  },
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    strictStatusCodes: true,
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: cacheControlsQueryRequestSchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  gpg: {
    method: "GET",
    path: "/gpg",
    strictStatusCodes: true,
    summary: "Fetch public PGP key (armored text)",
    query: cacheControlsQueryRequestSchemaDto.optional(),
    responses: fetchGpgFromUpstreamSchemaResponses,
  },
  debion: {
    method: "GET",
    path: "/debion",
    strictStatusCodes: true,
    summary: "Fetch debion setup script (raw text)",
    query: cacheControlsQueryRequestSchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  whisper: {
    method: "GET",
    path: "/whisper",
    strictStatusCodes: true,
    summary: "Fetch Whisper setup script (raw text)",
    query: cacheControlsQueryRequestSchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
});
