import { purgeViewWindow } from "./purgeViewWindow";
import { purgeTrashPosts } from "./purgeTrashPosts";
import { notify } from "./notify";

export const webhooks = {
  purgeViewWindow,
  purgeTrashPosts,
  notify,
} as const;
