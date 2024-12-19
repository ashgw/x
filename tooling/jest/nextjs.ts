import { Config } from "jest";

import { baseConfig } from "./base";

export const nextJsConfig: Config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  collectCoverageFrom: ["**/src/**/*.{js,ts,jsx,tsx}"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
    "^.+\\.jsx?$": "esbuild-jest",
  },
  coveragePathIgnorePatterns: [],
};
