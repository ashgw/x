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
      "**/e2e/**", // playwright tests are not ran by vitest
      "scripts/**", // if you have raw scripts checked in
    ],
  },
});
