import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  envDir: "./../../",
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/coverage/**",
      "**/.cache/**",
      "**/*.d.ts",
      "scripts/**", // if you have raw scripts checked in
    ],
  },
});
