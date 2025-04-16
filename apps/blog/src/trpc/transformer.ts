import superjson from "superjson";

// this can be transfered with the tRPC package tho
export const transformer = superjson as {
  serialize: typeof superjson.serialize;
  deserialize: typeof superjson.deserialize;
};
