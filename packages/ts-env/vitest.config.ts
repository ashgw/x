import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, defineProject, mergeConfig } from "vitest/config";

// importing using @ashgw/vitest-config keep erroring out, and it's annoying af!
import { baseConfig } from "./../../tooling/vitest";

export default mergeConfig(
  baseConfig,
  defineProject({
    plugins: [tsconfigPaths()],
    test: {
      includeSource: ["src/**/[!index]*.ts"],
    },
    resolve: {
      alias: {
        // @see https://stackoverflow.com/questions/73022020/vitest-not-recognizing-absolute-import
        "~/lib": path.resolve(__dirname, "./src/lib/"),
      },
    },
  }),
);
