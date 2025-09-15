import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  envDir: "./../../",
  test: {
    exclude: ["**/e2e/**", "**/node_modules/**"],
  },
});
