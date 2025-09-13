// TODO: export this in it's own package to be used both here on on tRPC
import type { Optional } from "ts-roids";
import { defaultShouldDehydrateQuery } from "@tanstack/react-query"; // TODO: add these to the package
import superjson from "superjson"; //  TODO: add superjson in catalog
import { QueryClient } from "@ts-rest/react-query/tanstack"; // PREFER @ts-rest for compatabilty

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          return false;
        },
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

let clientQueryClientSingleton: Optional<QueryClient> = null;

const isServer = typeof window === "undefined";

export function getOptimizedQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}
