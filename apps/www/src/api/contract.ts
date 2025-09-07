import {
  healthCheckSchemaResponses,
  fetchGpgFromUpstreamSchemaResponses,
  fetchTextFromUpstreamSchemaResponses,
  purgeViewWindowSchemaResponses,
} from "./schemas/responses";
import {
  fetchTextFromUpstreamQuerySchemaDto,
  purgeViewWindowHeadersSchemaDto,
} from "./schemas/dtos";
import { c } from "./root";

export const v1Contract = c.router({
  purgeViewWindow: {
    method: "DELETE",
    path: "/purge-view-window",
    strictStatusCodes: true,
    headers: purgeViewWindowHeadersSchemaDto,
    responses: purgeViewWindowSchemaResponses,
  },
  healthCheck: {
    method: "GET",
    path: "/health-check",
    strictStatusCodes: true,
    summary: "80 burpess, 100 squats and 50 pullups",
    responses: healthCheckSchemaResponses,
  },
  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    strictStatusCodes: true,
    summary: "Fetch dotfiles bootstrap script (raw text)",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  gpg: {
    method: "GET",
    path: "/gpg",
    strictStatusCodes: true,
    summary: "Fetch public PGP key (armored text)",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchGpgFromUpstreamSchemaResponses,
  },
  debion: {
    method: "GET",
    path: "/debion",
    strictStatusCodes: true,
    summary: "Fetch debion setup script (raw text)",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
  whisper: {
    method: "GET",
    path: "/whisper",
    strictStatusCodes: true,
    summary: "Fetch Whisper setup script (raw text)",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
});
