import { c } from "../ts-rest/root";
import type { Keys } from "ts-roids";
import { createContract } from "~/@ashgw/ts-rest";
import {
  healthCheckSchemaResponses,
  fetchGpgFromUpstreamSchemaResponses,
  fetchTextFromUpstreamQuerySchemaDto,
  purgeViewWindowHeadersSchemaDto,
  fetchTextFromUpstreamSchemaResponses,
  purgeViewWindowSchemaResponses,
  purgeTrashPostsHeadersSchemaDto,
  purgeTrashPostsSchemaResponses,
} from "~/api/models";

export const contract = createContract(c)({
  purgeViewWindow: {
    method: "DELETE",
    path: "/purge-view-window",
    strictStatusCodes: true,
    headers: purgeViewWindowHeadersSchemaDto,
    responses: purgeViewWindowSchemaResponses,
  },

  purgeTrashPosts: {
    method: "DELETE",
    path: "/purge-trash-posts",
    strictStatusCodes: true,
    headers: purgeTrashPostsHeadersSchemaDto,
    responses: purgeTrashPostsSchemaResponses,
  },

  healthCheck: {
    method: "GET",
    path: "/health-check",
    strictStatusCodes: true,
    summary: "80 burpess, 100 squats and 50 pullups",
    responses: healthCheckSchemaResponses, // 200
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

type Contract = typeof contract;
export type ContractRoute = Contract[Keys<Contract>];
