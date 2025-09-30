import { createLimiter } from "limico";

export const rl = createLimiter({
  kind: "quota",
  limit: 20,
  window: "60s",
});
