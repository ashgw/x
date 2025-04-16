import path from "path";
import { defineProject, mergeConfig } from "vitest/config";

// importing using @ashgw/vitest-config keep erroring out, and it's annoying af!
import { baseConfig } from "./../../tooling/vitest";

export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      globals: true,
      exclude: ["**/e2e/**"],
    },
    resolve: {
      alias: {
        // @see https://stackoverflow.com/questions/73022020/vitest-not-recognizing-absolute-import
        "~": path.resolve(__dirname, "./src"),
      },
    },
  }),
);
