export const endpoints = {
  reminder: "/reminders",
  notify: "/notifications",
  purgeViewWindow: "/purge-view-window",
  purgeTrashPosts: "/purge-trash-posts",
  healthCheck: "/health-check",
  oss: {
    gpg: "/gpg",
    bootstrap: "/bootstrap",
    debion: "/debion",
    whisper: "/whisper",
  },
} as const;
