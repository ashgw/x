import { c } from "../ts-rest/root";
import { createContract } from "ts-rest-kit/core";
import {
  healthSchemaResponses,
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
import { endpoints } from "./endpoints";

export const contract = createContract(c)({
  reminder: {
    method: "POST",
    path: endpoints.reminder,
    strictStatusCodes: true,
    summary: "Create reminder",
    description:
      "Creates a reminder using the provided headers and body payload.",
    headers: reminderHeadersSchemaDto,
    body: reminderBodySchemaDto,
    responses: reminderSchemaResponses,
  },

  notify: {
    method: "POST",
    path: endpoints.notification,
    strictStatusCodes: true,
    summary: "Send notification",
    description:
      "Dispatches a system notification using the provided headers and body payload.",
    headers: notifyHeadersSchemaDto,
    body: notifyBodySchemaDto,
    responses: notifySchemaResponses,
  },

  postPurgeViews: {
    method: "DELETE",
    path: endpoints.post.purge.views,
    strictStatusCodes: true,
    summary: "Purge view window data",
    description: "Deletes cached or temporary view window data from the blog.",
    headers: purgeViewWindowHeadersSchemaDto,
    responses: purgeViewWindowSchemaResponses,
  },

  postPurgeTrash: {
    method: "DELETE",
    path: endpoints.post.purge.trash,
    strictStatusCodes: true,
    summary: "Purge trashed posts",
    description: "Permanently deletes all posts currently in the trash bin.",
    headers: purgeTrashPostsHeadersSchemaDto,
    responses: purgeTrashPostsSchemaResponses,
  },

  health: {
    method: "GET",
    path: endpoints.health,
    strictStatusCodes: true,
    summary: "Health check",
    description: "Simple liveness probe to verify the API is running.",
    responses: healthSchemaResponses,
  },

  bootstrap: {
    method: "GET",
    path: endpoints.oss.bootstrap,
    strictStatusCodes: true,
    summary: "Fetch bootstrap script",
    description:
      "Returns a raw text bootstrap script for initializing dotfiles setup.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },

  gpg: {
    method: "GET",
    path: endpoints.oss.gpg,
    strictStatusCodes: true,
    summary: "Fetch public GPG key",
    description: "Returns my armored public GPG key as plain text.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchGpgFromUpstreamSchemaResponses,
  },

  debion: {
    method: "GET",
    path: endpoints.oss.debion,
    strictStatusCodes: true,
    summary: "Fetch Debion setup script",
    description:
      "Returns a raw text script for initializing the custom Debion login screen environment.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },

  whisper: {
    method: "GET",
    path: endpoints.oss.whisper,
    strictStatusCodes: true,
    summary: "Fetch Whisper setup script",
    description:
      "Returns a raw text script for configuring OpenAI's Whisper locally.",
    query: fetchTextFromUpstreamQuerySchemaDto.optional(),
    responses: fetchTextFromUpstreamSchemaResponses,
  },
});
