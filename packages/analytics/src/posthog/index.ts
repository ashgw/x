import { usePostHog } from "./client";
import { nodeClient as server } from "./server";

/**
 * The PostHog object that provides access to the server and client functionalities.
 *
 * @property {Object} server - The server-side PostHog client for backend usage.
 * @property {Object} client - The client-side PostHog configuration.
 * @property {function} client.usePostHog - A React hook to access the PostHog client
 *   within React components for tracking events and user identification.
 */
export const posthog = {
  server,
  client: {
    usePostHog,
  },
};
