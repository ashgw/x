import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // or 'node' based on your needs
    setupFiles: "./setup.ts", // Optional: path to your setup file
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
