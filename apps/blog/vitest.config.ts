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
        // Add src to the path resolution
        "~": path.resolve(__dirname, "./src"),
        // @see https://stackoverflow.com/questions/73022020/vitest-not-recognizing-absolute-import
        "~/lib": path.resolve(__dirname, "./src/lib/"),
      },
    },
  }),
);
