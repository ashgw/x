import { Config } from "jest";

import { baseConfig } from "./base";

export const serverConfig: Config = {
  ...baseConfig,
  testEnvironment: "jest-environment-node",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  collectCoverageFrom: ["src/**/*.test.{js,ts,}"],
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  transform: {
    "^.+\\.ts$": "esbuild-jest",
    "^.+\\.js$": "esbuild-jest",
  },
  coveragePathIgnorePatterns: [],
};
