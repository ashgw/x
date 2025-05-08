import { next } from "./nextJs";

// I'm not using @sentry/node now since I'm only using nextjs, add it when adding express or other framework
export const monitor = {
  next,
};
