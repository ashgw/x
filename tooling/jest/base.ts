import { Config } from "jest";

export const baseConfig: Config = {
  moduleDirectories: ["node_modules"],
  // I'm keeping Playwright tests in e2e, so just should ignore em
  testPathIgnorePatterns: ["/dist/", "/node_modules/", "<rootDir>/test/e2e/"],
  testMatch: ["**/tests/**/*.(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // To import using @ instead of ./../../
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
