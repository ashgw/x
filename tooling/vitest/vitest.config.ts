import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // or 'node' based on your needs
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
