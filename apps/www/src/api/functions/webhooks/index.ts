import { purgeViewWindow } from "./purgeViewWindow";
import { purgeTrashPosts } from "./purgeTrashPosts";

export const webhooks = {
  purgeViewWindow,
  purgeTrashPosts,
} as const;
