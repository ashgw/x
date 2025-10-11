export const endpoints = {
  reminder: "/reminder",
  notification: "/notification",
  post: {
    purge: {
      views: "/purge/views",
      trash: "/purge/trash",
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
