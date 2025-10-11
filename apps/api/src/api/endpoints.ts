export const endpoints = {
  reminder: "/reminder",
  notification: "/notification",
  post: {
    pruge: {
      purgeViewWindow: "/purge/view-window",
      purgeTrashPosts: "/purge/trash-posts",
    },
  },
  health: "/health",
  oss: {
    gpg: "/gpg",
    bootstrap: "/bootstrap",
    debion: "/debion",
    whisper: "/whisper",
  },
} as const;
