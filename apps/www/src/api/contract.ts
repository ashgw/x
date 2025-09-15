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
  notifyHeadersSchemaDto,
  notifyBodySchemaDto,
  notifySchemaResponses,
  reminderSchemaResponses,
  reminderHeadersSchemaDto,
  reminderBodySchemaDto,
} from "~/api/models";

export const contract = createContract(c)({
  notify: {
    method: "POST",
    path: "/notify",
    strictStatusCodes: true,
    summary: "Send notification",
    description:
      "Dispatches a system notification using the provided headers and body payload.",
    headers: notifyHeadersSchemaDto,
    body: notifyBodySchemaDto,
    responses: notifySchemaResponses,
  },

  reminder: {
    method: "POST",
    path: "/reminder",
    strictStatusCodes: true,
    summary: "Create reminder",
    description:
      "Creates a reminder using the provided headers and body payload.",
    headers: reminderHeadersSchemaDto,
    body: reminderBodySchemaDto,
    responses: reminderSchemaResponses,
  },

  purgeViewWindow: {
    method: "DELETE",
    path: "/purge-view-window",
    strictStatusCodes: true,
    summary: "Purge view window data",
    description: "Deletes cached or temporary view window data from the blog.",
    headers: purgeViewWindowHeadersSchemaDto,
    responses: purgeViewWindowSchemaResponses,
  },

  purgeTrashPosts: {
    method: "DELETE",
    path: "/purge-trash-posts",
    strictStatusCodes: true,
    summary: "Purge trashed posts",
    description: "Permanently deletes all posts currently in the trash bin.",
    headers: purgeTrashPostsHeadersSchemaDto,
    responses: purgeTrashPostsSchemaResponses,
  },

  healthCheck: {
    method: "GET",
    path: "/health-check",
    strictStatusCodes: true,
    summary: "Health check",
    description: "Simple liveness probe to verify the API is running.",
    responses: healthCheckSchemaResponses,
  },

  bootstrap: {
    method: "GET",
    path: "/bootstrap",
    strictStatusCodes: true,
    summary: "Fetch bootstrap script",
    description:
      "Returns a raw text bootstrap script for initializing dotfiles setup.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },

  gpg: {
    method: "GET",
    path: "/gpg",
    strictStatusCodes: true,
    summary: "Fetch public GPG key",
    description: "Returns my armored public GPG key as plain text.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchGpgFromUpstreamSchemaResponses,
  },

  debion: {
    method: "GET",
    path: "/debion",
    strictStatusCodes: true,
    summary: "Fetch Debion setup script",
    description:
      "Returns a raw text script for initializing the custom Debion login screen environment.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },

  whisper: {
    method: "GET",
    path: "/whisper",
    strictStatusCodes: true,
    summary: "Fetch Whisper setup script",
    description:
      "Returns a raw text script for configuring OpenAI's Whisper locally.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
});

type Contract = typeof contract;
export type ContractRoute = Contract[Keys<Contract>];
